import express, { type Request, type Response } from 'express';
import authRoutes from './routes/authRoutes';
import { cookieParser } from './middleware/cookieParser';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser);

app.use('/api/auth', authRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend server running');
});

app.use(errorHandler);

export default app;
