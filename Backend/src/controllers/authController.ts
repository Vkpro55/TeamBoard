import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { type IUser } from '../models/userModel';
import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',// send it to over HTTPS only in production
  sameSite: 'lax' as const,
};

const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

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

async function createTokensForUser(user: IUser, rememberMe = false) {
  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString(), rememberMe });
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(user._id, { refreshToken: refreshTokenHash } );
  return { accessToken, refreshToken };
}

function getRefreshCookieOptions(rememberMe = false) {
  return {
    ...REFRESH_COOKIE_OPTIONS,
    ...(rememberMe ? { maxAge: REFRESH_COOKIE_MAX_AGE } : {}),
  };
}

export async function signup(req: Request, res: Response) {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const { email, password, username, profilePic } = parseResult.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const user = await User.create({ email, password, username, profilePic });

  return res.status(201).json({
    user: buildUserResponse(user),
  });
}

export async function login(req: Request, res: Response) {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
  }

  const { email, password, rememberMe } = parseResult.data;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { accessToken, refreshToken } = await createTokensForUser(user, rememberMe);
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions(rememberMe));

  return res.status(200).json({
    accessToken,
    rememberMe,
    user: buildUserResponse(user),
  });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refresh_token;

  const sendLogoutSuccess = () => {
    res.clearCookie('refresh_token', REFRESH_COOKIE_CLEAR_OPTIONS);
    return res.status(200).json({ msg: 'Logged out successfully' });
  };

  if (!token) {
    return sendLogoutSuccess();
  }

  let userId: string;
  try {
    const payload = verifyRefreshToken(token);
    userId = payload.userId;
  } catch {
    // Logout should still clear the cookie when the refresh token is stale or malformed.
    return sendLogoutSuccess();
  }

  try {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
    return sendLogoutSuccess();
  } catch (error) {
    res.clearCookie('refresh_token', REFRESH_COOKIE_CLEAR_OPTIONS);
    return res.status(500).json({ error: 'Failed to log out. Please try again.' });
  }
}

export async function refreshAuth(req: Request, res: Response) {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user || !(await user.hasValidRefreshToken(token))) {
      return res.status(401).json({ error: 'Refresh token invalid or expired' });
    }

    const { accessToken, refreshToken } = await createTokensForUser(user, Boolean(payload.rememberMe));
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions(Boolean(payload.rememberMe)));

    return res.status(200).json({
      accessToken,
      rememberMe: Boolean(payload.rememberMe),
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token invalid or expired' });
  }
}

export async function me(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.status(200).json({ user });
}
