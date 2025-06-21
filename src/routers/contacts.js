// src/routers/contacts.js;
import { Router } from 'express';
import {
  getContactById,
  createContactsController,
  updateContactController,
  deleteContactController,
  getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

//Rout
router.get('/contacts', ctrlWrapper(getContactsController));
//Rout
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactById));
//Rout
router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);
//Rout
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
//Rout
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
