//src/middleware/errorHandler
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.data || null,
    });
    return;
  }
  console.log(err);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: true,
  });
};
