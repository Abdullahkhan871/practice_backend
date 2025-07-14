import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = (email) => {
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    })
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    })
    return {
        accessToken,
        refreshToken
    }
}

export default generateAccessAndRefreshToken;