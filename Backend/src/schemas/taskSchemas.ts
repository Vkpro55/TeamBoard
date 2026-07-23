import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id');

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  status: z.enum(['Todo', 'In Progress', 'Completed']).optional().default('Todo'),
  dueDate: z.coerce.date().optional().nullable(),
  assignedTo: objectIdSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Todo', 'In Progress', 'Completed']).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  assignedTo: objectIdSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});
