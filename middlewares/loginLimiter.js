const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 10,
    headers: true,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many login attempts, please try again later"
        })
    }
})

module.exports = loginLimiter