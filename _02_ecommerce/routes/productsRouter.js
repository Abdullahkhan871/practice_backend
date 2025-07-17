import e from "express";
import { addProduct, getCategory, getProducts, } from "../controllers/product.controller.js";
import { multerUploads } from "../middleware/multer.js";
const productRouter = e.Router();


productRouter.get("/", getProducts);
productRouter.post("/add", multerUploads, addProduct);
productRouter.get("/category/:x", getCategory);


export default productRouter;
