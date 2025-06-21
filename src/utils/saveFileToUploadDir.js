// src/utils/saveFileToUploadDir.js
import path from 'path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

//save and delete from temporary
export const saveFileToUploadDir = async (file) => {
  try {
    await fs.rename(
      path.join(TEMP_UPLOAD_DIR, file.filename),
      path.join(UPLOAD_DIR, file.filename),
    );
    return `${process.env.APP_DOMAIN}/uploads/${file.filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    await fs.unlink(path.join(TEMP_UPLOAD_DIR, file.filename));
    throw createHttpError(500, 'Error saving file to upload directory');
  }
};
