import sendResponse from "../utils/sendResponse.js"
import Product from "../models/product.model.js"

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

export {
    getCategory, getProducts
};