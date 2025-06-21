// src/middlewares/validateBody.js
import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false, // Показує всі помилки валідації
    });

    next();
  } catch (err) {
    const validationErrors = err.details.map((details) => ({
      message: details.message,
      path: details.path.join('.'),
      type: details.type,
      context: details.context,
    }));

    next(
      createHttpError(400, 'BadRequestErrors', {
        data: {
          message: 'Bad request validateBody',
          errors: validationErrors,
        },
      }),
    );
  }
};
