import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI=process.env.NODE_ENV === "local"? process.env.MONGO_LOCAL:process.env.MONGO_ATLAS
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Atlas connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
