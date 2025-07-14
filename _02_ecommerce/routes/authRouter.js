import e from "express";
import { login, logout, signup } from "../controllers/user.controller.js";
const authRouter = e.Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
