import mongoose from "mongoose";

const db = async () => {
    console.log("⏳ Connecting to:", process.env.MONGO_URI);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
};

export default db;
