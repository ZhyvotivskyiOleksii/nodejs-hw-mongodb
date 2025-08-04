import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  contactType: Joi.string().valid('work', 'personal', 'other'),
  isFavourite: Joi.boolean(),
  photo: Joi.string().allow(null),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  contactType: Joi.string().valid('work', 'personal', 'other'),
  isFavourite: Joi.boolean(),
  photo: Joi.string().allow(null),
}).min(1);
