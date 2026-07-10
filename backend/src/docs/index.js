const paths = require("./paths")
const schemas = require("./schemas")
const responses = require("./responses")

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
        }
    }
}