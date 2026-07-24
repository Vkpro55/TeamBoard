import { type Request, type Response } from 'express';
import { Types } from 'mongoose';
import Project from '../models/projectModel';
import Task from '../models/taskModel';
import { createProjectSchema, listProjectsQuerySchema, updateProjectSchema } from '../schemas/projectSchemas';

export async function listProjects(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const owner = new Types.ObjectId(req.user.id);

  const parseResult = listProjectsQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const { page, limit } = parseResult.data;
  const skip = (page - 1) * limit;

  const [projects, totalItems, statusCounts] = await Promise.all([
    Project.find({ owner: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments({ owner: req.user.id }),
    Project.aggregate<{ _id: string; count: number }>([
      { $match: { owner } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const countByStatus = statusCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return res.status(200).json({
    projects,
    stats: {
      total: totalItems,
      active: countByStatus.Active ?? 0,
      completed: countByStatus.Completed ?? 0,
    },
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  });
}

export async function createProject(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const parseResult = createProjectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const { name, description, status } = parseResult.data;

  const project = await Project.create({
    owner: req.user.id,
    name,
    description,
    status,
  });

  return res.status(201).json({ project });
}

export async function updateProject(req: Request, res: Response) {
  const parseResult = updateProjectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const project = await Project.findOne({
    _id: req.params.projectId,
    owner: req.user?.id,
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  Object.assign(project, parseResult.data);
  await project.save();

  return res.status(200).json({ project });
}

export async function deleteProject(req: Request, res: Response) {
  const project = await Project.findOne({
    _id: req.params.projectId,
    owner: req.user?.id,
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  return res.status(200).json({ message: 'Project deleted successfully' });
}

export async function archiveProject(req: Request, res: Response) {
  const project = await Project.findOne({
    _id: req.params.projectId,
    owner: req.user?.id,
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  project.status = 'Archived';
  await project.save();

  return res.status(200).json({
    message: 'Project archived successfully',
    project,
  });
}
