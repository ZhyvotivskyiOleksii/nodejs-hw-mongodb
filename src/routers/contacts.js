//src/router/contacts.js
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
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();


router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
