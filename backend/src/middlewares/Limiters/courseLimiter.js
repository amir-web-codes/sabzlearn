const rateLimit = require('express-rate-limit')

const courseLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many requests, please try again later"
        })
    }
})

module.exports = courseLimiter
