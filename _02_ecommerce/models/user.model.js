import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const User = mongoose.model("User", userSchema);
export default User;
