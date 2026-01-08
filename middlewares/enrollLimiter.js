const rateLimit = require("express-rate-limit")

const enrollLimiter = rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 10,
    keyGenerator: (req) => req.user.id,
    headers: true,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "too many requests, please try again later"
        })
    }
})

module.exports = enrollLimiter