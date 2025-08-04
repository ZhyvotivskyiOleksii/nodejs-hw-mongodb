import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

export const contactsRouter = express.Router();


contactsRouter.get('/', ctrlWrapper(getAllContacts));


contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactById));

contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(addContact));


contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);


contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));
