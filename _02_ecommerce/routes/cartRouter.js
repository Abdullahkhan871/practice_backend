import e from "express";
import { deleteUserCartProduct, getUserCart, postUserCart, } from "../controllers/cart.controller.js";
import isLogged from "../middleware/isLogged.js";
const cartRouter = e.Router();


cartRouter.get("/:userId", isLogged, getUserCart);
cartRouter.post("/:userId", isLogged, postUserCart);
cartRouter.post("/:userId/:productId", isLogged, deleteUserCartProduct);


export default cartRouter;
