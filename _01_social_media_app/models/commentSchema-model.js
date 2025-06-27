import mongoose from "mongoose";


const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model("comment", commentSchema);

