import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env';

export async function connectDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
