import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import { contactsRouter } from './routers/contacts.js';
import { authRouter } from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({ message: 'Сервер працює! ✌️' });
  });

  // ВАЖЛИВО: без додаткового authenticate тут
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // 404 після всіх роутів
  app.use(notFoundHandler);

  // Глобальний хендлер помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
