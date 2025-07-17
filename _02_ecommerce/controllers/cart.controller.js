import sendResponse from "../utils/sendResponse.js"

const getUserCart = (req, res) => {
    try {
        const { user } = req;
        console.log(user);
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}
const postUserCart = (req, res) => {
    try {

    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}
const putUserCart = (req, res) => {
    try {

    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}
const deleteUserCartProduct = (req, res) => {
    try {
        const { userId, productId } = req.params;

        console.log("check", userId, productId)
    } catch (error) {
        return sendResponse(res, 500, `error: ${error.message}`, false)
    }
}




export {
    getUserCart,
    postUserCart,
    putUserCart,
    deleteUserCartProduct
}
