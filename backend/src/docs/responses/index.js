const commonResponses = require("./common.response")
const userResponses = require("./user.response")
const ticketResponses = require("./ticket.response")
const lessonResponses = require("./lesson.response")
const commentResponses = require("./comment.response")
const cartResponses = require("./cart.response")
const categoryResponses = require("./category.response")
const tagResponses = require("./tag.response")

module.exports = {
    ...commonResponses,
    ...userResponses,
    ...ticketResponses,
    ...lessonResponses,
    ...commentResponses,
    ...cartResponses,
    ...categoryResponses,
    ...tagResponses
}