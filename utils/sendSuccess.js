async function sendSuccess(res, code = 200, message = "successful") {
    res.status(code).json({
        success: true,
        message
    })
}

module.exports = sendSuccess