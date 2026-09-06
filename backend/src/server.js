require("dotenv").config()

const app = require("./app")
const logger = require("./utils/logger")

const { connectRedis } = require("./configs/redis")
const connectDB = require("./configs/db")

const port = process.env.PORT || 7000

async function bootstrap() {
    try {
        await connectDB()
        await connectRedis()

        const server = app.listen(port, () => {
            logger.info(
                { port },
                "server started successfully"
            )
        })

        return server
    } catch (error) {
        logger.fatal(
            { error },
            "server failed to start"
        )

        process.exit(1)
    }
}

process.on("uncaughtException", (error) => {
    logger.fatal(
        { error },
        "uncaught exception"
    )

    process.exit(1)
})

process.on("unhandledRejection", (error) => {
    logger.fatal(
        { error },
        "unhandled rejection"
    )

    process.exit(1)
})

bootstrap()