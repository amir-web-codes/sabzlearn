const userPaths = require("./user.path")
const ticketPaths = require("./ticket.path")
const lessonPaths = require("./lesson.path")

module.exports = {
    ...userPaths,
    ...ticketPaths,
    ...lessonPaths
}