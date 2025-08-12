import { Contact } from '../models/Contact.js';

export const getContacts = async (filter = {}, options = {}) => {
  return await Contact.find(filter, null, options);
};

export const getContactsCount = async (filter = {}) => {
  return await Contact.countDocuments(filter);
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContactById = async (contactId, userId, data) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
};

export const deleteContactById = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
