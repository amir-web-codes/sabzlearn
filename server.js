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

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.use("/users", userRouter)
app.use("/courses", courseRouter)
app.use("/comments", commentRouter)

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