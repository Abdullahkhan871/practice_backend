import e from "express";
import { contact } from "../controllers/contact.controller.js";
import { limiter } from "../middleware/limiter.js";
const contactRouter = e.Router();


contactRouter.post("/", limiter, contact)

export {
    contactRouter
};