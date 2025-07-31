import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { contactsRouter } from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Рут для перевірки життя сервера
  app.get('/', (req, res) => {
    res.json({ message: 'Сервер працює! ✌️' });
  });

  // Головний API роут
  app.use('/api/contacts', contactsRouter);

  // Обробка 404
  app.use(notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
