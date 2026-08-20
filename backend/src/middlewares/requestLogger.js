const logger = require("../utils/logger")

const requestLogger = (req, res, next) => {
    req.requestId = req.headers["x-request-id"] || `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const start = Date.now()

    // res.on("finish", () => {
    //     const duration = Date.now() - start
    //     const logContext = {
    //         requestId: req.requestId,
    //         method: req.method,
    //         url: req.originalUrl,
    //         statusCode: res.statusCode,
    //         durationMs: duration,
    //         userAgent: req.get("user-agent"),
    //         message: err.message,
    //         stack: err.stack,
    //         errors: err.errors
    //     }

    //     if (res.statusCode >= 500) {
    //         logger.error(logContext, "request completed with server error")
    //     } else if (res.statusCode >= 400) {
    //         logger.warn(logContext, "request completed with client error")
    //     } else {
    //         logger.info(logContext, "request completed")
    //     }
    // })

    next()
}

module.exports = requestLogger
