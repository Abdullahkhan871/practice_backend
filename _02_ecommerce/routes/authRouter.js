import e from "express";
import { login, logout, refreshToken, signup } from "../controllers/user.controller.js";
import isLogged from "../middleware/isLogged.js";
const authRouter = e.Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", isLogged, logout);
authRouter.post("/refresh-token", isLogged, refreshToken);


export default authRouter;
