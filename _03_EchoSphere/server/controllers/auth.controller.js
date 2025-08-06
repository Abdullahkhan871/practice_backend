import { customeResponse } from "../utils/customeResponse.js";
import { isValidEmail, isValidPassword } from "../utils/patternValidator.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils.js";
import { dataUri } from "../middleware/multer.middleware.js";
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";


const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || name.length < 3 || !email?.trim() || !password?.trim()) {
      return customeResponse(res, "Provide all input", 400);
    }

    if (!isValidEmail(email)) {
      return customeResponse(res, "Email should look like this: example@gmail.com", 400);
    }

    if (!isValidPassword(password)) {
      return customeResponse(res, "Password should look like this: StrongP@ss1", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return customeResponse(res, "User already exists with this email", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isOnline: true,
    });

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return customeResponse(res, "User registered successfully", 201, {
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return customeResponse(res, error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return customeResponse(res, "Please provide email and password", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return customeResponse(res, "Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return customeResponse(res, "Invalid credentials", 401);
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return customeResponse(res, "Login successful", 200, {
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return customeResponse(res, error.message, 500);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return customeResponse(res, "Logged out successfully", 200);
  } catch (error) {
    return customeResponse(res, error.message, 500);
  }
};

const requsetPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email.trim()) {
      return customeResponse(res, "Something went wrong", 404)
    }

    const user = await User.findOne({ email });
    if (!user) {
      return customeResponse(res, "Something went wrong", 404)
    }

    const secret = process.env.JWT_SECRET + user.password;

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
    const resetURL = `https://${process.env.BACKEND_URL}/resetpassword?id=${user._id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);

    return customeResponse(res, "Request Link send to user email", 201)


  } catch (error) {
    console.log(error);
    return customeResponse(res, "Something went wrong", 500)
  }
};

const passwordReset = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return customeResponse(res, "User not exists!", 400,)
    }
    const secret = process.env.JWT_SECRET + user.password;
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 12);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    await user.save();
    return customeResponse(res, "Password has been reset", 200,)
  } catch (error) {
    console.log(error);
    return customeResponse(res, "Something went wrong", 500)
  }
};

const requestEmailVerify = async (req, res) => {
  try {
    const user = req.user;

    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      // to: user.email,
      to: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
      subject: "Email Verification OTP",
      text: `Use the following OTP to verify your email:\n\n${otp}\n\nIt will expire in 10 minutes.\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    // const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // await User.updateOne(
    //   { _id: user._id },
    //   { $set: { emailVerificationOtp: otp, emailOtpExpires: otpExpires } }
    // );

    return customeResponse(res, "OTP sent to email", 201);
  } catch (error) {
    console.error(error);
    return customeResponse(res, "Something went wrong", 500);
  }
};


const verifyEmail = (req, res) => {

}




const addPhone = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { phone } = req.body;

    if (!userId) {
      return customeResponse(res, "Unauthorized", 401);
    }

    if (!phone?.trim()) {
      return customeResponse(res, "Phone number is required", 400);
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return customeResponse(res, "Phone number already in use", 409);
    }

    // i should verify number by sms 
    const user = await User.findByIdAndUpdate(userId, { phone }, { new: true });

    if (!user) {
      return customeResponse(res, "User not found", 404);
    }

    return customeResponse(res, "Phone number updated successfully", 200, {
      phone: user.phone,
    });
  } catch (error) {
    return customeResponse(res, error.message, 500);
  }
};

const addProfilePic = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!req.file) {
      return customeResponse(res, "No file uploaded", 400,)
    }
    const file = dataUri(req.file).content;

    const result = await cloudinary.uploader.upload(file, {
      folder: "chat/profile_pics",
      resource_type: "image",
    })

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return customeResponse(res, "User not found", 404,)
    }
    return customeResponse(res, "Profile picture updated", 200, {
      profilePic: updatedUser.profilePic,
    })
  } catch (err) {
    return customeResponse(res, `${err}`, 500)
  }
};

const addAboutMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { aboutMe } = req.body;

    if (!aboutMe || aboutMe.trim().length < 1) {
      return customeResponse(res, "aboutMe cannot be empty", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { aboutMe },
      { new: true }
    ).select("aboutMe");

    if (!updatedUser) {
      return customeResponse(res, "User not found", 404);
    }

    return customeResponse(res, "aboutMe updated successfully", 200, {
      aboutMe: updatedUser.aboutMe,
    });
  } catch (error) {
    return customeResponse(res, "Server error", 500);
  }
};

export {
  signUp,
  login,
  logout,
  addPhone,
  addProfilePic,
  addAboutMe,
  requsetPasswordReset,
  passwordReset,
  requestEmailVerify,
};
