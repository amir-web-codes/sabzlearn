const express = require("express")
const helmet = require("helmet")
const path = require("path")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const { corsMiddleware, corsErrorHandler } = require("./cors")

function middlewares(app) {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(corsMiddleware)
    app.use(cookieParser())

    const globalRateLimiter = rateLimit({
        windowMs: 1000 * 60 * 20,
        max: 100,
        headers: true,
        handler: (req, res, next) => {
            res.status(429).json({
                success: false,
                message: "you're sending too many requests, slow down cowboy🤠"
            })
        }
    })

    app.use(globalRateLimiter)

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"))
    }

    app.use(express.static(path.join(__dirname, "../public")))
}

module.exports = middlewares