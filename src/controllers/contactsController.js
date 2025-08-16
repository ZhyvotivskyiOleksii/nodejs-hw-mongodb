import createError from 'http-errors';
import {
  getContacts,
  getContactsCount,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import { cloudinary } from '../utils/cloudinary.js';
import stream from 'stream';

// >>> додали: читаємо папку з ENV
const CLD_FOLDER = process.env.CLOUDINARY_FOLDER || 'contacts';

// >>> оновили з детальним логуванням помилки
const uploadBufferToCloudinary = (buffer, folder = CLD_FOLDER) =>
  new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) {
          console.error('[CLD] upload_stream error:', {
            message: err?.message,
            http_code: err?.http_code,
            name: err?.name,
          });
          return reject(err);
        }
        return resolve(result);
      }
    );
    pass.end(buffer);
    pass.pipe(upload);
  });

export const getContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filter = { userId: req.user._id };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await getContactsCount(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const contacts = await getContacts(filter, {
    sort: { [sortBy]: sortDirection },
    skip,
    limit: Number(perPage),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);
  if (!contact) throw createError(404, 'Контакт не знайдено');
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contactData = { ...req.body, userId: req.user._id };

  // >>> try/catch — не валимо запит, якщо аплоад не вдався
  if (req.file?.buffer) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      contactData.photo = result.secure_url;
    } catch (e) {
      console.warn('[CLD] skip photo on create:', e?.message);
    }
  }

  const newContact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Контакт успішно створено!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const data = { ...req.body };

  // >>> try/catch — не валимо запит, якщо аплоад не вдався
  if (req.file?.buffer) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      data.photo = result.secure_url;
    } catch (e) {
      console.warn('[CLD] skip photo on update:', e?.message);
    }
  }

  const updatedContact = await updateContactById(contactId, req.user._id, data);
  if (!updatedContact) throw createError(404, 'Контакт не знайдено');
  res.status(200).json({
    status: 200,
    message: 'Контакт успішно оновлено!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactById(contactId, req.user._id);
  if (!deletedContact) throw createError(404, 'Контакт не знайдено');
  res.status(204).send();
};

export const updateFavoriteController = async (req, res) => {
  const { contactId } = req.params;
  const { isFavourite } = req.body;
  if (typeof isFavourite !== 'boolean') {
    throw createError(400, 'Missing field isFavourite');
  }
  const updated = await updateContactById(contactId, req.user._id, { isFavourite });
  if (!updated) throw createError(404, 'Контакт не знайдено');
  res.status(200).json({
    status: 200,
    message: 'Контакт успішно оновлено!',
    data: updated,
  });
};
