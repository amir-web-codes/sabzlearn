require("dotenv").config()

const express = require("express")
const app = express()


const middlewares = require("./configs/middlewares")
middlewares(app)

require("./configs/db")()

const userRouter = require("./routers/userRouter")
const courseRouter = require("./routers/courseRouter")

app.use("/users", userRouter)
app.use("/courses", courseRouter)

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "route not found"
    })
})

const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)

const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})