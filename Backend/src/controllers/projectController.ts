import { type Request, type Response } from 'express';
import Project from '../models/projectModel';
import Task from '../models/taskModel';
import { createProjectSchema, updateProjectSchema } from '../schemas/projectSchemas';

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
