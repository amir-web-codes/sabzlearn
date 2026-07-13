const userPaths = require("./user.path")
const ticketPaths = require("./ticket.path")
const lessonPaths = require("./lesson.path")
const commentPaths = require("./comment.path")

module.exports = {
    ...userPaths,
    ...ticketPaths,
    ...lessonPaths,
    ...commentPaths
}