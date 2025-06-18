import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';

export const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId', ctrlWrapper(updateContactController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
