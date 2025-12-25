require("dotenv").config()

const express = require("express")
const app = express()


const middlewares = require("./configs/middlewares")
middlewares(app)

require("./configs/db")()

const userRouter = require("./routers/userRouter")

app.use("/user", userRouter)

const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})