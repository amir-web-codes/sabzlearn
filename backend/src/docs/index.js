const userPaths = require("./paths/user.path")
const userSchemas = require("./schemas/user.schema")

module.exports = {
    paths: {
        ...userPaths
    },
    components: {
        schemas: {
            ...userSchemas
        }
    }
}