const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

function middlewares(app) {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(cors())
    app.use(cookieParser())

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"))
    }

    app.use(express.static(path.join(__dirname, "../public")))
}

module.exports = middlewares