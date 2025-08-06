import mongoose from "mongoose";

export const db = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected locally");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
