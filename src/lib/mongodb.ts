import mongoose from 'mongoose';

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
      maxPoolSize: 10, // Optimize database connection count for serverless environments
      autoSelectFamily: false, // Prevents TLS issues with IPv6/IPv4 connection selection
    };

    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;

      if (!uri) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Please define the MONGODB_URI environment variable inside your deployment dashboard.');
        }
        
        // Dynamically import MongoMemoryServer only when needed in development
        const { MongoMemoryServer } = await import('mongodb-memory-server');

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
  } catch (e: any) {
    cached.promise = null;

    console.error('\n========================================================================');
    console.error('❌ MONGODB CONNECTION ERROR');
    console.error('========================================================================');
    console.error('Failed to connect to the MongoDB database.');
    console.error('Error details:', e.message || e);

    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb.net')) {
      console.error('\n👉 TROUBLESHOOTING STEPS FOR MONGODB ATLAS:');
      console.error('1. Check IP Whitelist: This error (especially SSL/TLS alert 80) usually');
      console.error('   means your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('   Log in to Atlas -> Security -> Network Access and add your IP.');
      console.error('   (For testing only, you can allow access from anywhere: 0.0.0.0/0)');
      console.error('2. Check Database Credentials: Make sure the username and password in');
      console.error('   your .env.local connection string are correct.');
      console.error('3. Local Fallback: If you want to run locally with a mock database,');
      console.error('   temporarily comment out or rename MONGODB_URI in your .env.local.');
    }
    console.error('========================================================================\n');

    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
