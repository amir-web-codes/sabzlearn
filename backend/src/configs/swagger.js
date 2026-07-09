const docs = require("../docs")

module.exports = {
    openapi: "3.0.3",
    info: {
        title: "Sabzlearn APIs",
        version: "1.0.0",
        description: "Sabzlearn backend documentation"
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 7000}`,
        }
    ],
    ...docs
}