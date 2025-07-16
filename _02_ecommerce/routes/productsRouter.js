import e from "express";
import { getCategory, getProducts, } from "../controllers/product.controller.js";
const productRouter = e.Router();


productRouter.get("/", getProducts);
productRouter.get("/category/:x", getCategory);


export default productRouter;
