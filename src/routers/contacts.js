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

// лишаємо автентифікацію тут (а з server.js приберемо)
contactsRouter.use(authenticate);

// GET /contacts
contactsRouter.get('/', ctrlWrapper(getContactsController));

// GET /contacts/:contactId
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PUT /contacts/:contactId (повне оновлення — якщо потрібно)
contactsRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// DELETE /contacts/:contactId
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

// PATCH /contacts/:contactId/favorite — має йти ПЕРЕД загальним PATCH
contactsRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrlWrapper(updateFavoriteController),
);

// ✅ ЗАГАЛЬНИЙ PATCH /contacts/:contactId (часткове оновлення)
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema), // schema має бути .min(1)
  ctrlWrapper(updateContactController),
);
