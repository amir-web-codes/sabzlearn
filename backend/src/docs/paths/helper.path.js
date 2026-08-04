const { jsonResponse } = require("./helpers")

module.exports = {
    "/health": {
        get: {
            tags: ["System"],
            operationId: "getHealth",
            summary: "Check API availability",
            security: [],
            responses: {
                200: jsonResponse("API is available", "HealthResponse")
            }
        }
    }
}
