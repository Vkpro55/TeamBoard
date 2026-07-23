import { type ErrorRequestHandler } from 'express';

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  type?: string;
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const error = err as HttpError;
  const statusCode = error.statusCode ?? error.status;

  if (statusCode === 400 || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};
