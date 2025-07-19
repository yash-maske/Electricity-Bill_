// config/connectdb.js
import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: 'electric_bil',
    };

    const conn = await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // stop server if DB not connected
  }
};

export default connectDB;
