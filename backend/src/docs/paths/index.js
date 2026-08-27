const userPaths = require("./user.path")
const ticketPaths = require("./ticket.path")
const lessonPaths = require("./lesson.path")
const commentPaths = require("./comment.path")
const categoryPaths = require("./category.path")
const tagPaths = require("./tag.path")

module.exports = {
    ...userPaths,
    ...ticketPaths,
    ...lessonPaths,
    ...commentPaths,
    ...categoryPaths,
    ...tagPaths
}