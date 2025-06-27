import e from "express";
import isLogged from "../middleware/isLogged.js";
import sendResponse from "../config/response.js";
import userSchemaModel from "../models/userSchema-model.js";
const feedRouter = e.Router();


feedRouter.get("/feed", isLogged, async (req, res) => {
    try {
        const user = req.user;
        const posts = await userSchemaModel.find({
            _id: { $in: user.following }
        })
            .select("-password")
            .populate("posts");

        return sendResponse(res, true, "success", { posts }, 200)
    } catch (error) {
        return sendResponse(res, false, "server error", null, 500);
    }
})

export default feedRouter;


