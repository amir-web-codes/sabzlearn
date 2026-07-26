const idParameter = require("./id.parameter")
const paginationParameters = require("./pagination.parameter")
const ticketParameter = require("./ticket.parameter")
const slugParameter = require("./slug.parameter")
const userParameter = require("./user.parameter")

module.exports = {
    ...idParameter,
    ...paginationParameters,
    ...ticketParameter,
    ...slugParameter,
    ...userParameter
}