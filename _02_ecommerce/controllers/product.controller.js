import sendResponse from "../utils/sendResponse.js"
import Product from "../models/product.model.js"
import { dataUri } from "../middleware/multer.js";
import { uploader } from "../config/cloudinaryConfig.js";

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length < 1) {
            return sendResponse(res, 404, "No Data available", false)
        }
        return sendResponse(res, 200, "Success", true, { products });
    } catch (error) {
        return sendResponse(res, 500, `error : ${error.message}`, false,)
    }
}
const getCategory = async (req, res) => {
    try {
        const { x } = req.params;
        if (!x.trim()) {
            return sendResponse(res, 400, "No params available", false);
        }
        const category = await Product.find({ category: x });
        console.log(category)
        if (!category || category.length < 1) {
            return sendResponse(res, 404, "No Data available", false)
        }
        return sendResponse(res, 200, "Success", true, { products: category });
    } catch (error) {
        return sendResponse(res, 500, `error : ${error.message}`, false,)
    }
}

const addProduct = async (req, res) => {
    try {
        const { name, price, category, subcategory, description, stock, } = req.body
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed"
            });
        }

        const file = dataUri(req.file).content;
        console.log("Original Name:", req.file.originalname);
        console.log("Mime Type:", req.file.mimetype);
        console.log("Data URI Starts:", dataUri(req.file).content.slice(0, 30));

        const result = await uploader.upload(file, {
            folder: "e_commerce"
        });
        console.log("Result Public ID:", result.public_id);

        console.log("Public ID Returned:", result.public_id);

        const newProduct = await Product.create({
            name,
            price,
            category,
            subcategory: subcategory?.split(',') || [],
            description,
            stock: stock || 1,
            image: result.url
        });

        console.log(result.public_id)

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });
    } catch (err) {
        return sendResponse(res, 500, `error: ${err.message}`, false)
    }
};

export {
    getCategory, getProducts, addProduct
};