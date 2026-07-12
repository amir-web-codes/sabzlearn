const commonSchemas = require("./common.schema")
const userSchemas = require("./user.schema")
const ticketSchemas = require("./ticket.schema")

module.exports = {
    ...commonSchemas,
    ...userSchemas,
    ...ticketSchemas
}