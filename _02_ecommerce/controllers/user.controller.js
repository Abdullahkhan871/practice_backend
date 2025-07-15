import User from "../models/user.model.js";
import sendResponse from "../utils/sendResponse.js";
import options from "../utils/option.js";
import bcrypt from "bcrypt"
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js"
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../utils/pattern.js";
import jwt from "jsonwebtoken";

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
            return sendResponse(res, 400, "Password should be like: Abdullah@1 or ad@qweA125", false)
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
        res.cookie("refreshToken", refreshToken, options(process.env.REFRESH_TOKEN_EXPIRE))
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
        const { accessToken } = req?.cookies;
        if (!accessToken) {
            return sendResponse(res, 401, "Unauthorized", false);
        }
        const verifyAcceseToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        await User.updateOne({ email: verifyAcceseToken.email }, { refreshToken: "" });
        res.clearCookie("accessToken",
            {
                httpOnly: true,
                secure: true,
                sameSite: "Strict"
            });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        return sendResponse(res, 200, "User Logout", true);
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req?.cookies;
        if (!refreshToken?.trim()) {
            return sendResponse(res, 401, "Unauthorized", false);
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findOne({ email: decoded.email });

        if (!user || user.refreshToken !== refreshToken) {
            return sendResponse(res, 403, "refresh token Invalid", false);
        };

        const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshToken(decoded.email);
        await user.updateOne({ refreshToken: newRefreshToken });

        res.cookie("accessToken", accessToken, options(process.env.ACCESS_TOKEN_EXPIRE));
        res.cookie("refreshToken", newRefreshToken, options(process.env.REFRESH_TOKEN_EXPIRE));
        return sendResponse(res, 200, "tokens got refresh", true)
    } catch (error) {
        return sendResponse(res, 500, `error : ${error.message}`, false);
    }
}
export { login, logout, signup, refreshToken };