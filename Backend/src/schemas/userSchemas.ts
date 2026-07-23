import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().trim().min(3).optional(),
  profilePic: z.string().trim().optional(),
}).refine((data) => data.profilePic === undefined || data.profilePic === '' || z.string().url().safeParse(data.profilePic).success, {
  path: ['profilePic'],
  message: 'Profile photo must be a valid URL',
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'Passwords do not match',
}).refine((data) => data.currentPassword !== data.newPassword, {
  path: ['newPassword'],
  message: 'New password must be different from current password',
});