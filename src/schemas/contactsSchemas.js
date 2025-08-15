import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  phoneNumber: Joi.string().trim().min(3).required(),   // <-- ВАЖЛИВО
  email: Joi.string().trim().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(1),
  phoneNumber: Joi.string().trim().min(3),               // <-- ВАЖЛИВО
  email: Joi.string().trim().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
})
  .min(1)
  .messages({
    'object.min': 'Body must have at least one field',
  });

export const updateFavoriteSchema = Joi.object({
  isFavourite: Joi.boolean().required(),
});
