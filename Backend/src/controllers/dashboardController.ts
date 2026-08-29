import { type Request, type Response } from 'express';
import Project from '../models/projectModel';
import Task from '../models/taskModel';

type Activity = {
  type: 'project' | 'task';
  id: string;
  title: string;
  status: string;
  project?: string;
  timestamp: Date;
};

export async function getDashboard(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const owner = req.user.id;
  const projects = await Project.find({ owner }).select('_id');
  const projectIds = projects.map((project) => project._id);

  const [totalProjects, totalTasks, completedTasks, recentProjects, recentTasks] = await Promise.all([
    Project.countDocuments({ owner }),
    Task.countDocuments({ project: { $in: projectIds } }),
    Task.countDocuments({ project: { $in: projectIds }, status: 'Completed' }),
    Project.find({ owner }).sort({ updatedAt: -1 }).limit(5).select('name status updatedAt'),
    Task.find({ project: { $in: projectIds } })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt project')
      .populate('project', 'name'),
  ]);

  const recentActivity: Activity[] = [
    ...recentProjects.map((project) => ({
      type: 'project' as const,
      id: project._id.toString(),
      title: project.name,
      status: project.status,
      timestamp: project.updatedAt,
    })),
    ...recentTasks.map((task) => ({
      type: 'task' as const,
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      project: (task.project as unknown as { name?: string })?.name,
      timestamp: task.updatedAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return res.status(200).json({
    totals: {
      projects: totalProjects,
      tasks: totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    },
    recentActivity,
  });
}
