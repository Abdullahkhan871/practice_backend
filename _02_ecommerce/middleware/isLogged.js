import jwt from "jsonwebtoken";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/user.model.js";

const isLogged = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return sendResponse(res, 401, "Unauthorized", false);
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ email: decoded.email });
        req.user = user;
        console.log(req.user)
        next()
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
};

export default isLogged;