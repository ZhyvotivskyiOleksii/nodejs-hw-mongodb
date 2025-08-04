import { BadRequest } from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(BadRequest(error.message));
    }
    next();
  };
};
