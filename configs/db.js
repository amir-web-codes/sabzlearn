const mongoose = require("mongoose")

async function getDB() {
    try {
        await mongoose.connect(process.env.DATABASEURL)
        console.log("connected to database successfully")

    } catch (err) {
        console.log(`database connection error: ${err}`)
    }
}

module.exports = getDB