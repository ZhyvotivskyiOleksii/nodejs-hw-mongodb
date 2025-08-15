import httpErrors from 'http-errors';
const { BadRequest } = httpErrors;

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(BadRequest(error.message)); 
    }
    next();
  };
};
