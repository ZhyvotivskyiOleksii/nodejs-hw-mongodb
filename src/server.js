import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';

import { contactsRouter } from './routers/contacts.js';
import { authRouter } from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

// щоб мати __dirname в ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerJsonPath = path.resolve(__dirname, '../docs/swagger.json');

export const setupServer = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({ message: 'Сервер працює! ✌️' });
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, async (req, res) => {
    try {
      const doc = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));
      return res.send(swaggerUi.generateHTML(doc));
    } catch (e) {
      return res.status(500).json({ message: 'Swagger is not built yet' });
    }
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};
