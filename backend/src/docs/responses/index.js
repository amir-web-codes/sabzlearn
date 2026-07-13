const commonResponses = require("./common.response")
const userResponses = require("./user.response")
const ticketResponses = require("./ticket.response")
const lessonResponses = require("./lesson.response")

module.exports = {
    ...commonResponses,
    ...userResponses,
    ...ticketResponses,
    ...lessonResponses
}