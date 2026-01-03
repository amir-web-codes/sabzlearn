function sendError(res, code = 500, message = "internal server error") {
    res.status(code).json({
        success: false,
        message
    })
}

module.exports = sendError