import e from "express";
import { login, logout, refreshToken, signup } from "../controllers/user.controller.js";
import isLogged from "../middleware/isLogged.js";
const authRouter = e.Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);


export default authRouter;
