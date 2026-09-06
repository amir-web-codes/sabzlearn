const express = require("express")

const middlewares = require("./configs/middlewares")
const { corsErrorHandler } = require("./configs/cors")
const requestLogger = require("./middlewares/requestLogger")

const userRouter = require("./routers/userRouter")
const courseRouter = require("./routers/courseRouter")
const categoryRouter = require("./routers/categoryRouter")
const commentRouter = require("./routers/commentRouter")
const lessonRouter = require("./routers/lessonRouter")
const tagRouter = require("./routers/tagRouter")
const ticketRouter = require("./routers/ticketRouter")
const cartRouter = require("./routers/cartRouter")

const swaggerUI = require("swagger-ui-express")
const swaggerSpec = require("./configs/swagger")

const errorHandler = require("./middlewares/errorHandler")

const app = express()

middlewares(app)
app.use(requestLogger)

app.use("/users", userRouter)
app.use("/courses", courseRouter)
app.use("/categories", categoryRouter)
app.use("/comments", commentRouter)
app.use("/lessons", lessonRouter)
app.use("/tags", tagRouter)
app.use("/tickets", ticketRouter)
app.use("/cart", cartRouter)

app.use(corsErrorHandler)

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "ok"
    })
})

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec)
)

function notFound(req, res, next) {
    const error = new Error(`route ${req.originalUrl} not found`)
    error.status = 404

    next(error)
}

app.use(notFound)

app.use(errorHandler)

module.exports = app