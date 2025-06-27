import express from "express";
import isLogged from "../middleware/isLogged.js";
import sendResponse from "../config/response.js";
import userSchemaModel from "../models/userSchema-model.js";
import bcrypt from "bcrypt"
const userRouter = express.Router();
import { EMAILPATTERN, PASSWORDPATTERN } from "../config/pattern.js"
import mongoose from "mongoose";

// get current user 

userRouter.get("/me", isLogged, (req, res) => {
    return sendResponse(res, true, "user", {
        user: {
            username: req.user.username,
            email: req.user.email
        }
    })
})

// edit profle 
userRouter.put("/edit", isLogged, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username.trim() || !email.trim() || !password.trim()) {
            return sendResponse(res, false, "Please fill all requirement", null, 400)
        }
        if (username.length < 3) {
            return sendResponse(res, false, "username more tham 3 word", null, 400)
        }
        if (!EMAILPATTERN.test(email)) {
            console.log(email)
            return sendResponse(res, false, "email should look like Akhan@gmail.com", null, 400)
        }

        if (!PASSWORDPATTERN.test(password)) {
            return sendResponse(res, false, "Password should look like Akhan@123", null, 400)
        }

        const existingUserWithEmail = await userSchemaModel.findOne({ email })

        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== req.user._id.toString()) {
            return sendResponse(res, false, "user exist with this email", null, 400)
        }

        // hasing password
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);


        const findUser = await userSchemaModel.updateOne({ _id: req.user._id }, { username, email, password: hash })

        return sendResponse(res, true, "user register", {
            user: {
                username,
                email
            }
        })

    }
    catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }
})

// delete user 
userRouter.delete("/delete", isLogged, async (req, res) => {
    try {
        const _Id = req.user._id
        const deleteUser = await userSchemaModel.findByIdAndDelete(_Id)
        if (!deleteUser) {
            return sendResponse(res, false, "user not found",)
        }
        return sendResponse(res, true, "user delete",)
    }
    catch (error) {
        return sendResponse(res, false, "server error", null, 500)
    }

})

// get user profile
userRouter.get("/:username", isLogged, async (req, res) => {
    try {
        const username = req.params.username
        const existUser = await userSchemaModel.findOne({ username })

        if (!existUser) {
            return sendResponse(res, false, "user not found", null, 400)
        }
        return sendResponse(res, true, "user found", {
            user: {
                username: existUser.username,
                email: existUser.email,
            }
        })
    }
    catch (err) {
        return sendResponse(res, false, "something went wrong", null, 500)
    }
})

// follow or unfollow
// id => whom user want to follow or unfollow.
userRouter.put("/:id/follow", isLogged, async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;

        if (!mongoose.Types.ObjectId.isValid(id) || user._id.toString() == id.toString()) {
            return sendResponse(res, false, "bad request", null, 401);
        }
        console.log("1")
        const userExist = await userSchemaModel.findById(id);
        if (!userExist) {
            return sendResponse(res, false, "user not found", null, 404);
        }

        const isFollowing = await userSchemaModel.findOne({
            _id: id,
            followers: user._id
        });


        if (!isFollowing) {
            userExist.followersCount += 1;
            userExist.followers.push(user._id)
            let userExistSave = await userExist.save();
            if (!userExistSave) {
                return sendResponse(res, false, "server error", { error: userExistSave }, 500)
            }
            user.followingCount += 1;
            user.following.push(id)
            await user.save()
            return sendResponse(res, true, "success", { creater: userExist }, 200);
        }

        userExist.followersCount -= 1;
        userExist.followers.pull(user._id)
        let userExistSave = await userExist.save();
        if (!userExistSave) {
            return sendResponse(res, false, "server error", { error: userExistSave }, 500)
        }
        user.followingCount -= 1;
        user.following.pull(id)
        await user.save()
        return sendResponse(res, true, "success", { creater: userExist }, 200);
    } catch (error) {
        return sendResponse(res, false, "server error", { error }, 500)
    }

})

// get followers 
userRouter.get("/:userId/followers", isLogged, async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendResponse(res, false, "bad request", null, 401);
        }
        const isUserExist = await userSchemaModel.findById(userId).populate("followers", "username profilePic posts followers following followersCount followingCount");
        console.log("1")
        if (!isUserExist) {
            return sendResponse(res, false, "user not found", null, 404);
        }
        return sendResponse(res, true, "success", { user: isUserExist.followers }, 404);
    } catch (error) {
        return sendResponse(res, false, "servor error", { error }, 500)
    }
})
// get following 
userRouter.get("/:userId/following", isLogged, async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendResponse(res, false, "bad request", null, 401);
        }
        const isUserExist = await userSchemaModel.findById(userId).populate("following", "username profilePic posts followers following followersCount followingCount");
        console.log("1")
        if (!isUserExist) {
            return sendResponse(res, false, "user not found", null, 404);
        }
        return sendResponse(res, true, "success", { user: isUserExist.following }, 404);
    } catch (error) {
        return sendResponse(res, false, "servor error", { error }, 500)
    }
})


export default userRouter