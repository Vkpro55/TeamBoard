import dotenv from 'dotenv';

dotenv.config();

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'jwt-access-secret-123';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'jwt-refresh-secret-123';
export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';
export const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/teamboard';
export const PORT = Number(process.env.PORT) || 3000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV ?? 'development';
