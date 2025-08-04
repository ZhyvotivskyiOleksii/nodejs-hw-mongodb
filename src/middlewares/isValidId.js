import { isValidObjectId } from 'mongoose';
import { BadRequest } from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(BadRequest(`${contactId} is not valid id`));
  }
  next();
};
