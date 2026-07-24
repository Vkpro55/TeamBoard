import express, { type Request, type Response } from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import allTaskRoutes from './routes/allTaskRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import { cookieParser } from './middleware/cookieParser';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser);
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', allTaskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend server running');
});

app.use(errorHandler);

export default app;
