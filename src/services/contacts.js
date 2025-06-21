//src / services / contacts.js;
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// Получение всех контактов с фильтрацией и пагинацией
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  filter = {},
  sort = { name: 1 },
}) => {
  const limit = parseInt(perPage, 10);
  const skip = (parseInt(page, 10) - 1) * limit;

  try {
    console.log('Filter applied:', filter);
    console.log('Pagination params:', { page, perPage, limit, skip });
    console.log('Sort params:', sort);


    const contactsQuery = ContactsCollection.find({ userId: filter.userId }).sort(sort);


    const totalCount = await ContactsCollection.find()
      .merge(contactsQuery)
      .countDocuments();


    const contacts = await contactsQuery.skip(skip).limit(limit);


    const paginationData = calculatePaginationData(totalCount, perPage, page);

    return { data: contacts, ...paginationData };
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw createHttpError(500, 'Failed to fetch contacts');
  }
};



// Получение контакта по ID
export const getContactByIdService = async (contactId, userId) => {
  if (!contactId) throw createHttpError(400, 'Contact ID is required');

  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');

  return contact;
};

// Создание контакта
export const createContact = async (payload) => {
  if (payload.email) {
    const existingContact = await ContactsCollection.findOne({
      email: payload.email,
      userId: payload.userId,
    });

    if (existingContact) {
      throw createHttpError(
        400,
        `Contact with email ${payload.email} already exists`
      );
    }
  }

  return await ContactsCollection.create(payload);
};


// Обновление контакта
export const updateContact = async (contactId, updateData, userId) => {
  if (!contactId) throw createHttpError(400, 'Contact ID is required');

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedContact) throw createHttpError(404, 'Contact not found');
  return updatedContact;
};

// Удаление контакта
export const deleteContact = async (contactId, userId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  return deletedContact;
};


