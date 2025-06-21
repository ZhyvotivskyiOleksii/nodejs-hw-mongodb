//src/db/initMongoConnection
import mongoose from 'mongoose';
import 'dotenv/config';

const DB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

export const initMongoConnection = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', DB_URI);
    await mongoose.connect(DB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
