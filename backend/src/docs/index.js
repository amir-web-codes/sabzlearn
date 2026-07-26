const paths = require("./paths")
const schemas = require("./schemas")
const responses = require("./responses")
const parameters = require("./parameters")
const securitySchemes = require("./security")
const tags = require("./tags")

module.exports = {
    tags,
    paths: {
        ...paths
    },
    components: {
        schemas: {
            ...schemas
        },
        responses: {
            ...responses
        },
        parameters: {
            ...parameters
        },
        securitySchemes: {
            ...securitySchemes
        }
    }
}