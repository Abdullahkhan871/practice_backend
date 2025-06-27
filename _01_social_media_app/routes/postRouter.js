import e from "express";
import isLogged from "../middleware/isLogged.js";
import sendResponse from "../config/response.js";
import postSchema from "../models/postSchema-model.js"
import upload from "../utils/upload.js";
import userSchemaModel from "../models/userSchema-model.js";
import mongoose from "mongoose";
import commentSchema from "../models/commentSchema-model.js";
const postRouter = e.Router();

// create post
postRouter.post("/", isLogged, upload.single('file'), async (req, res) => {
    try {
        const { caption } = req.body;
        const fileUrl = req.file?.path

        if (!caption.trim() || !fileUrl) {
            return sendResponse(res, false, null, null, 400);
        }
        const createPost = new postSchema({
            userId: req.user._id,
            caption,
            image: fileUrl
        })
        const post = await createPost.save();

        if (!post) {
            return sendResponse(res, false, null, null, 500);
        }

        const foundUser = await userSchemaModel.findById(req.user._id);

        foundUser.posts.push(createPost._id);
        const updateUser = await foundUser.save()

        if (!updateUser) {
            return sendResponse(res, false, "updateUser server error", null, 500)
        }
        return sendResponse(res, true, "Success", createPost, 200)
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

// get user by id posts 
postRouter.get("/user/:userId", isLogged, async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
            return sendResponse(res, false, "Invalid userId", null, 400)
        }
        const foundUser = await userSchemaModel.findOne({ _id: userId }).populate("posts");

        console.log("1", foundUser)
        if (!foundUser) {
            return sendResponse(res, false, "user not found", null, 404)
        }
        return sendResponse(res, true, "success", {
            user: {
                userId: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                profilePic: foundUser.profilePic,
            },
            posts: foundUser.posts,
        }, 200)

    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

// get single post 
postRouter.get("/:postId", isLogged, async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId.trim()) {
            return sendResponse(res, false, "no post id", null, 400)
        }
        const isLiked = await postSchema.findById(postId)
        if (!isLiked) {
            return sendResponse(res, false, "found not available", null, 400)
        }
        return sendResponse(res, true, "post found", { post: isLiked }, 200)
    } catch (error) {
        console.log(error)
        return sendResponse(res, false, "server error", null, 500)
    }
})

// edit post 
postRouter.put("/edit/:postId", isLogged, upload.single("file"), async (req, res) => {
    try {
        const postId = req.params.postId;
        const fileUrl = req.file.path;
        const { caption } = req.body;
        if (!mongoose.Types.ObjectId.isValid(postId) || !fileUrl.trim()) {
            return sendResponse(res, false, "Bad request", null, 400)
        }
        const post = await postSchema.findById(postId);
        if (!post) {
            return sendResponse(res, false, "post not found", null, 404)
        }

        console.log(post._id.toString(), req.user._id.toString())

        if (post.userId.toString() != req.user._id.toString()) {
            return sendResponse(res, false, "Bad request", null, 401)
        }

        post.caption = caption;
        post.image = fileUrl;
        const postSaved = post.save()

        if (!postSaved) {
            return sendResponse(res, false, "Bad request", null, 400)
        }
        return sendResponse(res, true, "success", { post }, 200)
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

// delete post 
postRouter.delete("/:postId", isLogged, async (req, res) => {
    try {
        const postId = req.params;
        const user = req.user;

        // first need to check is owner or not of this post 

        const postUser = await postSchema.findOne({ _id: postId });

        console.log(postUser)

        const foundPost = await postSchema.deleteOne(postId);
        if (foundPost.deletedCount < 1) {
            return sendResponse(res, false, "post not found", null, 500)
        }
        return sendResponse(res, true, "user delete", foundPost, 200)
    } catch (error) {
        return sendResponse(res, false, "Servor error", null, 500)
    }
})

postRouter.post("/comments/:postId", isLogged, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;
        const { text } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId) || !text.trim()) {
            return sendResponse(res, false, "bad request", null, 401);
        }
        console.log("1", postId, userId, text)
        const existPost = await postSchema.findById(postId);
        if (!existPost) {
            return sendResponse(res, false, "post not found", null, 401);
        }
        const createComment = new commentSchema({
            postId,
            userId,
            text,
        });
        const comment = await createComment.save();

        if (!comment) {
            return sendResponse(res, false, null, null, 500)
        }

        existPost.comments.push(comment);
        const post = await existPost.save();

        return sendResponse(res, true, "success", { post }, 200)
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

postRouter.get("/comments/:postId", isLogged, async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return sendResponse(res, false, "bad request", null, 401);
        };
        const isLiked = await postSchema.findById(postId).populate({
            path: "comments",
            populate: {
                path: "userId",
                select: "_id username profilePic"
            }
        });
        console.log(isLiked)
        if (!isLiked) {
            return sendResponse(res, false, "post not found", null, 401);
        };
        const comments = isLiked.comments;
        if (!comments) {
            return sendResponse(res, false, "something went wrong", null, 500);
        }
        return sendResponse(res, true, "success", { comments }, 200);
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

// like and unlike  
postRouter.put("/:postId/like", isLogged, async (req, res) => {

    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
            return sendResponse(res, false, "bad request", null, 401);
        };

        const isLiked = await postSchema.findById(postId);

        if (!isLiked) {
            return sendResponse(res, false, "post not found", null, 404);
        }

        let foundLikedUser = isLiked.usersWhoLikes.includes(userId.toString());

        if (!foundLikedUser) {
            isLiked.likesCount = isLiked.likesCount + 1
            isLiked.usersWhoLikes.push(userId);
            await isLiked.save();
            return sendResponse(res, true, "success", { post: isLiked }, 200)
        } else {
            isLiked.likesCount = isLiked.likesCount - 1
            isLiked.usersWhoLikes = isLiked.usersWhoLikes.filter(id => id.toString() != userId.toString());
            await isLiked.save();
            return sendResponse(res, true, "success", { post: isLiked }, 200)
        }
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})
export default postRouter;