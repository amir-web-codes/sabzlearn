const mongoose = require("mongoose")
const logger = require("../utils/logger")

async function getDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("connected to database successfully")
        const sanitizedUrl = (process.env.DATABASE_URL || "").replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
        logger.info({ database: sanitizedUrl }, "connected to database successfully")
    } catch (err) {
        console.log(`database connection error: ${err}`)
        logger.error({ err }, "database connection error")
    }
}

module.exports = getDB