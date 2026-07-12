const paths = require("./paths")
const schemas = require("./schemas")
const responses = require("./responses")
const parameters = require("./parameters")

module.exports = {
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
        }
    }
}