const commonSchemas = require("./common.schema")
const userSchemas = require("./user.schema")
const ticketSchemas = require("./ticket.schema")
const lessonSchemas = require("./lesson.schema")
const commentSchemas = require("./comment.schema")
const cartSchemas = require("./cart.schema")

module.exports = {
    ...commonSchemas,
    ...userSchemas,
    ...ticketSchemas,
    ...lessonSchemas,
    ...commentSchemas,
    ...cartSchemas
}