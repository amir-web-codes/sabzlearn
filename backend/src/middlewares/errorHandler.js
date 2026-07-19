const logger = require("../utils/logger")
const fs = require("fs")

const errorHandler = async (err, req, res, next) => {
    const status = err.status || 500
    const context = {
        status,
        method: req.method,
        url: req.originalUrl,
        requestId: req.requestId,
        message: err.message,
        stack: err.stack,
        errors: err.errors
    }

    if (status >= 500) {
        if (process.env.NODE_ENV === "development") {
            console.log(`server error: ${err.stack}`)
        }

        logger.error(context, "server error")
        err.message = "internal server error"
    } else if (status >= 400) {
        logger.warn(context, "client error")
    }

    if (req.uploadedFile) {
        await deleteFile(req.uploadedFile.public_id)
    }

    res.status(status).json({
        success: false,
        message: err.message,
        errors: err.errors,
        code: err.code,
        details: err.details
    })
}

module.exports = errorHandler