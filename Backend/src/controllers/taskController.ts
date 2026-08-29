import { type Request, type Response } from 'express';
import Project from '../models/projectModel';
import Task from '../models/taskModel';
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from '../schemas/taskSchemas';

function getParam(req: Request, name: 'projectId' | 'taskId') {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}

async function getOwnedProject(projectId: string, userId: string) {
  return Project.findOne({
    _id: projectId,
    owner: userId,
  });
}

export async function listTasks(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const parseResult = listTasksQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const { page, limit, search, status, priority, sortBy } = parseResult.data;
  const skip = (page - 1) * limit;
  const projects = await Project.find({ owner: req.user.id }).select('_id');
  const projectIds = projects.map((project) => project._id);

  const filter: Record<string, unknown> = { project: { $in: projectIds } };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const sort: Record<string, 1 | -1> =
    sortBy === '-dueDate' ? { dueDate: -1, createdAt: -1 } : { dueDate: 1, createdAt: -1 };

  const [tasks, totalItems] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('project', 'id name status')
      .populate('assignedTo', 'id username email'),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json({
    tasks,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  });
}

export async function getProjectTasks(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const project = await getOwnedProject(getParam(req, 'projectId'), req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const tasks = await Task.find({ project: project._id })
    .sort({ dueDate: 1, createdAt: -1 })
    .populate('assignedTo', 'id username email');

  return res.status(200).json({ tasks });
}

export async function createTask(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const parseResult = createTaskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const project = await getOwnedProject(getParam(req, 'projectId'), req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const task = await Task.create({
    project: project._id,
    assignedTo: parseResult.data.assignedTo ?? undefined,
    title: parseResult.data.title,
    description: parseResult.data.description,
    priority: parseResult.data.priority,
    status: parseResult.data.status,
    dueDate: parseResult.data.dueDate ?? undefined,
  });

  return res.status(201).json({ task });
}

export async function updateTask(req: Request, res: Response) {
  const parseResult = updateTaskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const project = await getOwnedProject(getParam(req, 'projectId'), req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const task = await Task.findOne({
    _id: getParam(req, 'taskId'),
    project: project._id,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  Object.assign(task, parseResult.data);
  await task.save();

  return res.status(200).json({ task });
}

export async function deleteTask(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const project = await getOwnedProject(getParam(req, 'projectId'), req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const task = await Task.findOne({
    _id: getParam(req, 'taskId'),
    project: project._id,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await task.deleteOne();

  return res.status(200).json({ message: 'Task deleted successfully' });
}

export async function markTaskComplete(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const project = await getOwnedProject(getParam(req, 'projectId'), req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const task = await Task.findOne({
    _id: getParam(req, 'taskId'),
    project: project._id,
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.status = 'Completed';
  await task.save();

  return res.status(200).json({
    message: 'Task marked as complete',
    task,
  });
}
