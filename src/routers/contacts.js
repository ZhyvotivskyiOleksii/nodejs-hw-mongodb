import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

export const contactsRouter = express.Router();

// Захист для всіх роутів (auth-middleware)
contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
