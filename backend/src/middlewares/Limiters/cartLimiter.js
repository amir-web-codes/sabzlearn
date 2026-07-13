const rateLimit = require('express-rate-limit')

const cartLimiter = rateLimit({
    windowMs: 1000 * 60 * 2,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many requests, please try again later"
        })
    }
})

module.exports = cartLimiter
