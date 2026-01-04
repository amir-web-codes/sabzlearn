function sendError(code = 500, message = "internal server error") {
    const err = new Error(message)
    err.status = code
    throw err
}

module.exports = sendError