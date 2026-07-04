require("dotenv").config()

const express = require("express")
const app = express()

const path = require("path")


const middlewares = require("./configs/middlewares")
const { corsErrorHandler } = require("./configs/cors")
const requestLogger = require("./middlewares/requestLogger")
const logger = require("./utils/logger")
middlewares(app)

app.use(requestLogger)

process.on("uncaughtException", (error) => {
    console.log(error)
    logger.fatal({ error }, "uncaught exception")
    setTimeout(() => {
        process.exit(1)
    }, 100)
})

process.on("unhandledRejection", (reason) => {
    console.log(reason)
    logger.fatal({ error: reason }, "unhandled rejection")
    setTimeout(() => {
        process.exit(1)
    }, 100)
})

async function callDB() {
    await require("./configs/db")()
}

callDB()

const userRouter = require("./routers/userRouter")
const courseRouter = require("./routers/courseRouter")
const commentRouter = require("./routers/commentRouter")
const lessonRouter = require("./routers/lessonRouter")
const ticketRouter = require("./routers/ticketRouter")
const cartRouter = require("./routers/cartRouter")

app.use("/users", userRouter)
app.use("/courses", courseRouter)
app.use("/comments", commentRouter)
app.use("/lessons", lessonRouter)
app.use("/tickets", ticketRouter)
app.use("/cart", cartRouter)

app.use(corsErrorHandler)

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "ok"
    })
})

function notFound(req, res, next) {
    const err = new Error(`route ${req.originalUrl} not found`)
    err.status = 404

    next(err)
}

app.use(notFound)

const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)

const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`server is running on port: ${process.env.PORT}`)
    logger.info({ port }, "server started successfully")
})
