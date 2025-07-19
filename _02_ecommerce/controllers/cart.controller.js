import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Cart from "../models/cart.model.js";
import sendResponse from "../utils/sendResponse.js"

const getUserCart = async (req, res) => {
    try {
        const { user } = req;
        const cart = await Cart.findOne({ _id: user._id }).populate("Product");
        return sendResponse(res, 200, "success", true, {
            cart
        });
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}

const postUserCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return sendResponse(res, 400, "Cart must contain at least one product", false);
        }

        for (const item of products) {
            if (!item.productId || typeof item.quantity !== "number" || item.quantity < 1 || mongoose.Types.ObjectId.isValid(item._id)) {
                return sendResponse(res, 400, "Invalid product format in cart", false);
            }
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { products },
            { new: true, upsert: true }
        );

        return sendResponse(res, 200, "Cart updated successfully", true, updatedCart);
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false);
    }
};

const deleteUserCartProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return sendResponse(res, 400, "User ID and Product ID are required", false);
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { products: { productId } } },
            { new: true }
        );

        if (!updatedCart) {
            return sendResponse(res, 404, "Cart not found for the user", false);
        }

        return sendResponse(res, 200, "Product removed from cart successfully", true, updatedCart);
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false);
    }
};

export {
    getUserCart,
    postUserCart,
    deleteUserCartProduct
}
