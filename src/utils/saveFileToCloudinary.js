// src/utils/saveFileToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import createHttpError from 'http-errors';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw createHttpError(500, 'Error uploading file to Cloudinary');
  }
};
