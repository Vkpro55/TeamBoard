import { type ErrorRequestHandler } from 'express';

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  type?: string;
  code?: number;
  errors?: Record<string, { message: string }>;
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const error = err as HttpError;
  const statusCode = error.statusCode ?? error.status;

  if (statusCode === 400 || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (error.name === 'ValidationError') {
    const fieldErrors = Object.fromEntries(
      Object.entries(error.errors ?? {}).map(([field, e]) => [field, e.message]),
    );
    return res.status(400).json({ error: fieldErrors });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: 'Duplicate value' });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};
