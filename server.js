require("dotenv").config()

const express = require("express")
const app = express()

const path = require("path")


const middlewares = require("./configs/middlewares")
middlewares(app)

require("./configs/db")()

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


app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "route not found"
    })
})

const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)

module.exports = app