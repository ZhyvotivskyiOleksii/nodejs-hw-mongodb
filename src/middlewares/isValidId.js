//src/middlewares/isValidId

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// Ця функція для забезпечення коректної роботи API та захисту від можливих помилок або атак.

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, `Invalid ObjectId format: ${contactId}`);
  }
  next();
};
