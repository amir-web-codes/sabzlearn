const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
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

    res.status(status).json({
        success: false,
        message: err.message,
        errors: err.errors
    })
}

module.exports = errorHandler