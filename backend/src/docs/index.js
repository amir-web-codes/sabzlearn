const userPaths = require("./paths/user.path")
const userSchemas = require("./schemas/user.schema")
const commonSchemas = require("./schemas/common.schema")
const commonResponses = require("./responses/common.response")
const userResponses = require("./responses/user.response")

module.exports = {
    paths: {
        ...userPaths
    },
    components: {
        schemas: {
            ...userSchemas,
            ...commonSchemas
        },
        responses: {
            ...commonResponses,
            ...userResponses
        }
    }
}