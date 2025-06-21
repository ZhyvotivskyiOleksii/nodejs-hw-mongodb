//src / controllers / contacts.js;
import createHttpError from 'http-errors';
import {
  createContact,
  updateContact,
  deleteContact,
  getAllContacts,
  getContactByIdService,
} from '../services/contacts.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// get all
export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, filter } = req.query;

  try {
    const { data, ...meta } = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter: { ...filter, userId: req.user._id },
    });

    res.json({
      status: 200,
      message: 'Contacts retrieved successfully',
      data: { data, ...meta },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

// get by id
export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactByIdService(contactId, req.user._id);
    res.json({
      status: 200,
      message: `Contact with ID ${contactId} retrieved successfully`,
      data: contact,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

// create
export const createContactsController = async (req, res) => {
  try {
    let photo = null;

    if (req.file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        photo = await saveFileToCloudinary(req.file);
      } else {
        photo = await saveFileToUploadDir(req.file);
      }
    }

    const contactData = {
      ...req.body,
      userId: req.user._id,
      photo,
    };

    const contact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

// delete
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  try {
    await deleteContact(contactId, req.user._id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

// update
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  let photoUrl = null;

  try {
    if (req.file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        photoUrl = await saveFileToCloudinary(req.file); // Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(req.file); // Local
      }
    }

    const updateData = {
      ...req.body,
      ...(photoUrl && { photo: photoUrl }),
    };

    const updatedContact = await updateContact(
      contactId,
      updateData,
      req.user._id,
    );

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error patching contact:', error);
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};
