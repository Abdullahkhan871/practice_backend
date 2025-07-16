import rateLimit from "express-rate-limit";
import ms from "ms";

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after an hour.",
    },
});

export {
    limiter
};