import jwt from "jsonwebtoken";
import sendResponse from "../config/response.js";
import userSchemaModel from "../models/userSchema-model.js"

async function isLogged(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return sendResponse(res, false, "Unauthorized", null, 401)
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return sendResponse(res, false, "Unauthorized", null, 401)
        }
        const checkUser = await userSchemaModel.findOne({ _id: decoded.id })
        if (!checkUser) {
            return sendResponse(res, false, "Unauthorized", null, 401)
        }
        req.user = checkUser;
        console.log("working")
        next();
    }
    catch (err) {
        return sendResponse(res, false, err.message, { error: err }, 500)
    }
}
export default isLogged;