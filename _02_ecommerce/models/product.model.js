import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category:
    {
        type: String,
        required: true,
    },
    subcategory: [
        {
            type: String,
            required: true,
        }
    ],
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 1,
        required: true,
    }
}, {
    timestamps: true
});
const Product = mongoose.model("Product", productSchema);
export default Product;