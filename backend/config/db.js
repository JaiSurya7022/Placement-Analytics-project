import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connects to your local MongoDB server instance
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/placement_readiness_db');
    console.log(`MongoDB Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection dropped: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;   