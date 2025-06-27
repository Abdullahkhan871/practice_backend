import mongoose from "mongoose"


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dborrzr90/image/upload/v1747571161/p_img41_zu00gx.png"
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Post"
        }
    ],
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],
    followersCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
        min: 0,
    }
})

export default mongoose.model("User", userSchema);