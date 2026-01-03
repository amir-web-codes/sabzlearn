require("dotenv").config()

const express = require("express")
const app = express()


const middlewares = require("./configs/middlewares")
middlewares(app)

require("./configs/db")()

const userRouter = require("./routers/userRouter")

app.use("/users", userRouter)

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "route not found"
    })
})

const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})