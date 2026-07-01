require("dotenv").config()

const express = require("express")
const app = express()

const path = require("path")


const middlewares = require("./configs/middlewares")
middlewares(app)

async function callDB() {
    await require("./configs/db")()
}

callDB()

const userRouter = require("./routers/userRouter")
const courseRouter = require("./routers/courseRouter")
const commentRouter = require("./routers/commentRouter")
const lessonRouter = require("./routers/lessonRouter")
const ticketRouter = require("./routers/ticketRouter")

app.use("/users", userRouter)
app.use("/courses", courseRouter)
app.use("/comments", commentRouter)
app.use("/lessons", lessonRouter)
app.use("/tickets", ticketRouter)

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
    console.log(`server is running on port ${port}`)
})