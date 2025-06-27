import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    usersWhoLikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    likesCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "comment"
        }
    ]
},
    {
        timestamps: true,
    },)

export default mongoose.model("Post", postSchema)

