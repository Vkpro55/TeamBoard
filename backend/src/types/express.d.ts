import type { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      cookies?: Record<string, string>;
      user?: {
        id: string;
        email: string;
        username?: string;
        profilePic?: string;
      };
    }
  }
}

export {};
