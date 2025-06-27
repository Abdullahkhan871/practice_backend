import express, { response } from "express";
import sendResponse from "../config/response.js";
import { EMAILPATTERN, PASSWORDPATTERN } from "../config/pattern.js";
import userSchemaModel from "../models/userSchema-model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import isLogged from "../middleware/isLogged.js";

const authRouter = express.Router();

// register 
authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body

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

        const existingUser = await userSchemaModel.findOne({ email })

        if (existingUser) {
            return sendResponse(res, false, "This user email exist", null, 400)
        }


        // hasing password
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        const user = new userSchemaModel({
            username,
            email,
            password: hash,
        })

        if (!user) {
            return sendResponse(res, false, "server error", null, 500)
        }

        const savedUser = await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        console.log("token", token);

        res.cookie("token", token, {
            httpOnly: true,
        });
        return sendResponse(res, true, "user register", { token })

    }
    catch (err) {
        return sendResponse(res, false, "server error", { error: err }, 500)
    }
})
// login 
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email.trim() || !password.trim()) {
            return sendResponse(res, false, "Please fill all requirement", null, 400)
        }
        if (!EMAILPATTERN.test(email)) {
            return sendResponse(res, false, "Invalid email format", null, 400)
        }

        if (!PASSWORDPATTERN.test(password)) {
            return sendResponse(res, false, "Password should look like Akhan@123", null, 400)
        }

        const existingUser = await userSchemaModel.findOne({ email })

        if (!existingUser) {
            return sendResponse(res, false, "not authorized", null, 400)
        }
        const checkUser = await bcrypt.compare(password, existingUser.password)

        if (!checkUser) {
            return sendResponse(res, false, "not authorized", null, 400)
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        console.log("token", token)

        res.cookie("token", token, {
            httpOnly: true,
        });
        return sendResponse(res, true, "Login successful", { token, username: existingUser.username })
    }
    catch (err) {
        return sendResponse(res, false, "server error", null, 500)
    }
})
// logout 
authRouter.get("/logout", isLogged, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    })

    console.log(req.user)
    return sendResponse(res, true, "logout success", null);
})

export default authRouter;