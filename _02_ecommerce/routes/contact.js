import e from "express";
const contactRouter = e.Router();


contactRouter.post("/", (req, res) => {
    const { name, email, message } = req.body;
    if (!name.trim() || !email.trim() || !message.trim())
})