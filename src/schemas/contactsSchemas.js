import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phoneNumber: Joi.string().min(3).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(1),
  phoneNumber: Joi.string().min(3),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  isFavourite: Joi.boolean().required(),
});
