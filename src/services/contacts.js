import { Contact } from '../models/Contact.js';

// Отримати всі контакти
export const getContacts = async (filter = {}, options = {}) => {
  return await Contact.find(filter, null, options);
};

// Порахувати кількість контактів (для пагінації)
export const getContactsCount = async (filter = {}) => {
  return await Contact.countDocuments(filter);
};

// Отримати один контакт по id та userId
export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

// Створити новий контакт
export const createContact = async (data) => {
  return await Contact.create(data);
};

// Оновити контакт по id та userId
export const updateContactById = async (contactId, userId, data) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true }
  );
};

// Видалити контакт по id та userId
export const deleteContactById = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
