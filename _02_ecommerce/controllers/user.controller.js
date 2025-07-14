import User from "../models/user.model";
import sendResponse from "../utils/sendResponse.js";
import options from "../utils/options.js";
import bcrypt from "bcrypt"
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js"
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../utils/pattern.js";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return sendResponse(res, 400, "Bad request", false)
        }
        if (!EMAIL_PATTERN.test(email)) {
            return sendResponse(res, 400, "email should be like these : Abdullah@1gmail.com or abkhan@2gmail.co", false)
        }
        if (!PASSWORD_PATTERN.test(password)) {
            return sendResponse(res, 400, "email should be like these : Abdullah@1 or ad@qweA125", false)
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendResponse(res, 409, "user already exist", false,)
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(email);

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password: hashPassword, refreshToken });

        res.cookie("accessToken", accessToken, options(process.env.ACCESS_TOKEN_EXPIRE))
        return sendResponse(res, 201, "User created successfully", true, {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        return sendResponse(res, 500, "Server error", false)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password?.trim()) {
            return sendResponse(res, 400, "Bad request", false)
        }
        if (!EMAIL_PATTERN.test(email)) {
            return sendResponse(res, 400, "email should be like these : Abdullah@1gmail.com or abkhan@2gmail.co", false)
        }
        if (!PASSWORD_PATTERN.test(password)) {
            return sendResponse(res, 400, "email should be like these : Abdullah@1 or ad@qweA125", false)
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 401, "Unauthorized", false)
        }
        const checkUser = await bcrypt.compare(password, user.password);
        if (!checkUser) {
            return sendResponse(res, 400, "Password or email incorrect", false,)
        }

        const { refreshToken, accessToken } = generateAccessAndRefreshToken(email);

        await user.updateOne({ refreshToken });

        res.cookie("accessToken", accessToken, options(process.env.ACCESS_TOKEN_EXPIRE))
        return sendResponse(res, 200, "Login successful", true, {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return sendResponse(res, 500, "Server error", false)
    }
}
const logout = async (req, res) => {
    try {

    } catch (error) {
        return sendResponse(res, 500, "Server error", false)
    }
}


export { login, logout, signup };