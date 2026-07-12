const commonResponses = require("./common.response")
const userResponses = require("./user.response")
const ticketResponses = require("./ticket.response")

module.exports = {
    ...commonResponses,
    ...userResponses,
    ...ticketResponses
}