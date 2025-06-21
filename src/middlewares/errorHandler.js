// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something goes wrong';

  res.status(status).json({
    status,
    message,
    data: message,
  });
};
