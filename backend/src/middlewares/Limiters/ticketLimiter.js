const rateLimit = require("express-rate-limit")

const ticketLimiter = rateLimit({
    windowMs: 1000 * 60 * 30,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "you're sending too many tickets, please try again later"
        })
    }
})

module.exports = ticketLimiter