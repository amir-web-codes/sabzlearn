const commonSchemas = require("./common.schema")
const userSchemas = require("./user.schema")

module.exports = {
    ...commonSchemas,
    ...userSchemas
}