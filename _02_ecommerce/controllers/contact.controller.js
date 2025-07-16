import Contact from "../models/contact.model.js";
import sendResponse from "../utils/sendResponse.js";

const contact = async (req, res) => {
    try {
        console.log(req.name)
        const { name, email, message } = req.body;
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return sendResponse(res, 400, "fill all input", false);
        };
        await Contact.create({
            name,
            email,
            message
        })
        return sendResponse(res, 204, "no need return value", true)
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}

export {
    contact
}