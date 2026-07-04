const rateLimiter = require("express-rate-limit")

const requestLimiter = rateLimiter({
    windowMs: 1000 * 60 * 60,
    max: 10,
    headers: true,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many requests, please try again later"
        })
    }
})

module.exports = requestLimiter