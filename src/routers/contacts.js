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
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from '../schemas/contactsSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

export const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

// PUT (повне оновлення) — залишаємо як було
contactsRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

// PATCH /contacts/:contactId/favorite — має йти ПЕРЕД загальним PATCH /:contactId
contactsRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrlWrapper(updateFavoriteController)
);

// PATCH /contacts/:contactId — часткове оновлення (partial)
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema), // updateContactSchema має бути .min(1)
  ctrlWrapper(updateContactController)
);
