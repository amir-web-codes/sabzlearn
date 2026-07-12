const userPaths = require("./user.path")
const ticketPaths = require("./ticket.path")

module.exports = {
    ...userPaths,
    ...ticketPaths
}