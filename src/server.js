import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Подключение middleware
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser()); // Подключаем cookie-parser для работы с cookies

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Подключение маршрутов
  app.use(router);

  // Обработка несуществующих маршрутов
  app.use('*', notFoundHandler);

  // Обработка ошибок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
