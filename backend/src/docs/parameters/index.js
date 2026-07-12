const idParameter = require("./id.parameter")
const pageParameter = require("./page.parameter")
const limitParameter = require("./limit.parameter")

module.exports = {
    ...idParameter,
    ...pageParameter,
    ...limitParameter
}