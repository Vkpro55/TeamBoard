import { type Request, type Response } from 'express';
import User, { type IUser } from '../models/userModel';
import { updatePasswordSchema, updateProfileSchema } from '../schemas/userSchemas';

const REFRESH_COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

function buildUserResponse(user: IUser) {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    profilePic: user.profilePic,
  };
}

export async function updateProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const parseResult = updateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  if (Object.keys(parseResult.data).length === 0 && !req.file) {
    return res.status(400).json({ error: 'At least one field or profile photo must be provided for update' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { username, profilePic } = parseResult.data;
  if (username !== undefined) {
    user.username = username;
  }

  if (profilePic !== undefined) {
    user.profilePic = profilePic || undefined;
  }

  if (req.file) {
    user.profilePic = `${req.protocol}://${req.get('host')}/uploads/profile-pics/${req.file.filename}`;
  }

  await user.save();

  return res.status(200).json({
    message: 'Profile updated successfully',
    user: buildUserResponse(user),
  });
}

export async function updatePassword(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const parseResult = updatePasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { currentPassword, newPassword } = parseResult.data;
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  res.clearCookie('refresh_token', REFRESH_COOKIE_CLEAR_OPTIONS);
  return res.status(200).json({ message: 'Password updated successfully. Please log in again.' });
}