const rateLimit = require("express-rate-limit")

const adminLimiter = rateLimit({
    windowMs: 1000 * 60 * 20,
    max: 250,
    headers: true,
    keyGenerator: (req) => req.user.role,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "you're sending too many requests, slow down cowboy🤠"
        })
    }
})

module.exports = adminLimiter