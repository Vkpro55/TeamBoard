import type { RequestHandler } from 'express';
import cors from 'cors';
import { CLIENT_ORIGIN } from '../config/env';

export const corsMiddleware: RequestHandler = cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
