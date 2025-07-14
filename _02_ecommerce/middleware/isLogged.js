import sendResponse from "../utils/sendResponse.js";

const isLogged = (req, res, next) => {
    try {

    } catch (error) {
        return sendResponse(res, 500, "false", false)
    }
};

export default isLogged;