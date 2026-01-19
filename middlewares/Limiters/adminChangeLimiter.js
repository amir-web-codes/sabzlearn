const rateLimiter = require("express-rate-limit")

const adminChangeLimiter = rateLimiter({
    windowMs: 1000 * 60 * 30,
    max: 3,
    headers: true,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many requests, please try again later"
        })
    }
})

module.exports = adminChangeLimiter