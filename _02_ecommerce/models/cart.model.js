import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            }
        }
    ]
}, {
    timestamps: true,
});
const Cart = mongoose.model("cart", cartSchema);
export default Cart;