// src/servicer/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

//create
export const createContact = async (payload) => {
  // Проверяем существование контакта с таким email
  const existingContact = await ContactsCollection.findOne({
    email: payload.email,
  });
  if (existingContact) {
    throw createHttpError(
      400,
      `Contact with email ${payload.email} already exists`,
    );
  }

  // Если email уникален, создаем контакт
  const contact = await ContactsCollection.create(payload);
  return contact;
};

//update
export const updateContact = async (contactId, updateData) => {
  if (!contactId) {
    throw createHttpError(400, 'Contact ID is required');
  }
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedContact;
};

//delete
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};

//get
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  try {
    // Применяем фильтры
    const contactsQuery = ContactsCollection.find(filter);
    const contactsCount = await ContactsCollection.find()
      .merge(contactsQuery)
      .countDocuments();

    const contacts = await contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw error;
  }
};
