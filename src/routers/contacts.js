import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
  updateFavoriteController,
} from '../controllers/contactsController.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

export const contactsRouter = express.Router();

// Захищаємо всі контакти
contactsRouter.use(authenticate);

// GET /contacts
contactsRouter.get('/', ctrlWrapper(getContactsController));

// GET /contacts/:contactId
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts  (підтримує multipart/form-data з файлом photo)
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

// PUT /contacts/:contactId  (повне оновлення, також приймає photo)
contactsRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

// DELETE /contacts/:contactId
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

// PATCH /contacts/:contactId/favorite  (спеціальне поле — має бути ПЕРЕД загальним PATCH)
contactsRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrlWrapper(updateFavoriteController)
);

// PATCH /contacts/:contactId  (часткове оновлення, як на скріні ментора)
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);
