import mongoose from "mongoose";
// mongodb+srv://kulkantsharma9883_db_user:ksharma9883@cluster0.bzybmqu.mongodb.net/

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
