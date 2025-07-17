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
        const { name, price, category, subcategory, description, stock, } = req.body;
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return sendResponse(res, 400, "Only image files are allowed", false)
        };

        if (!name?.trim() || !price || category?.trim() || !subcategory.length > 0, !description?.trim() || !stock) {
            return sendResponse(res, 400, "Need All value", false)
        }

        const file = dataUri(req.file).content;

        const result = await uploader.upload(file, {
            folder: "e_commerce"
        });

        const newProduct = await Product.create({
            name,
            price,
            category,
            subcategory: subcategory?.split(',') || [],
            description,
            stock: stock || 1,
            image: result.url
        });
        sendResponse(res, 201, "Product added successfully", {
            products: newProduct,
        })
    } catch (err) {
        return sendResponse(res, 500, `error: ${err.message}`, false)
    }
};

export {
    getCategory, getProducts, addProduct
};