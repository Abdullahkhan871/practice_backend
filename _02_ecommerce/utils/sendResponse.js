const sendResponse = (res, statusCode = 200, message = "success", status = true, data = null) => {
    res.status(statusCode).json({
        success: status,
        message,
        data
    })
}
export default sendResponse;