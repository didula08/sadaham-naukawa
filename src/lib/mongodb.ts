import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, mongod: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;

      if (!uri) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Please define the MONGODB_URI environment variable inside your deployment dashboard.');
        }
        if (!cached.mongod) {
          console.log('Starting MongoDB Memory Server...');
          cached.mongod = await MongoMemoryServer.create();
        }
        uri = cached.mongod.getUri();
        console.log(`Connected to mock MongoDB: ${uri}`);
      }

      return mongoose.connect(uri!, opts);
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
