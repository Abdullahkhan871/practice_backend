import jwt from "jsonwebtoken";
import { customeResponse } from "../utils/customeResponse.js";

const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    let tokenToVerify = accessToken || refreshToken;

    if (!tokenToVerify) {
      return customeResponse(res, "No token provided", 401);
    }

    const secret = accessToken
      ? process.env.JWT_SECRET
      : process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      return customeResponse(res, "JWT secret not set", 500);
    }

    const decoded = jwt.verify(tokenToVerify, secret);
    req.user = decoded;

    next();
  } catch (err) {
    return customeResponse(res, "Invalid or expired token", 403);
  }
};

export { authMiddleware };
