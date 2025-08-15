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

// Авторизація на всі маршрути всередині роутера
contactsRouter.use(authenticate);

// GET /contacts
contactsRouter.get('/', ctrlWrapper(getContactsController));

// GET /contacts/:contactId
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts  (multipart або json — обидва ок)
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH /contacts/:contactId   <-- головний для оновлення
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// (опційно) PUT /contacts/:contactId — якщо треба для ДЗ
contactsRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// PATCH /contacts/:contactId/favorite
contactsRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrlWrapper(updateFavoriteController),
);

// DELETE /contacts/:contactId
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
