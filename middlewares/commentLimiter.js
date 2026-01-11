const rateLimit = require("express-rate-limit")

const commentLimiter = rateLimit({
    windowMs: 1000 * 60 * 1,
    max: 1,
    headers: true,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "you created comment recently, please try again later"
        })
    }
})

module.exports = commentLimiter