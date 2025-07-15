import mongoose from 'mongoose';
const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default db;
