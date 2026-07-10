const commonResponses = require("./common.response")
const userResponses = require("./user.response")

module.exports = {
    ...commonResponses,
    ...userResponses
}