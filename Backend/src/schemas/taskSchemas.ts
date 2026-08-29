import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id');

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const dueDateSchema = z.coerce
  .date()
  .refine((date) => date >= startOfToday(), 'Due date cannot be in the past')
  .optional()
  .nullable();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  status: z.enum(['Todo', 'In Progress', 'Completed']).optional().default('Todo'),
  dueDate: dueDateSchema,
  assignedTo: objectIdSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Todo', 'In Progress', 'Completed']).optional(),
  dueDate: dueDateSchema,
  assignedTo: objectIdSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  search: z.string().trim().max(160).optional(),
  status: z.enum(['Todo', 'In Progress', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  sortBy: z.enum(['dueDate', '-dueDate']).default('dueDate'),
});
