import { isValidObjectId } from 'mongoose';
import httpErrors from 'http-errors';
const { BadRequest } = httpErrors;

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(BadRequest(`${contactId} is not valid id`));
    return;
  }

  next();
};
