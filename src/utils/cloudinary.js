// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

// >>> тимчасовий лог для діагностики (не показує секрет)
console.log('[CLD] cloud_name=', process.env.CLOUDINARY_CLOUD_NAME, 'api_key=', process.env.CLOUDINARY_API_KEY);

export { cloudinary };
