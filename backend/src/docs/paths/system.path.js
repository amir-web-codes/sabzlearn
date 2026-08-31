module.exports = {
    "/health": {
        get: {
            tags: ["System"],
            summary: "Check API health",
            description: "Checks the health and availability of the API and its dependencies.",
            responses: {
                200: {
                    description: "API and its dependencies are healthy.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true
                                    },
                                    status: {
                                        type: "string",
                                        example: "ok"
                                    }
                                },
                                required: [
                                    "success",
                                    "status"
                                ]
                            }
                        }
                    }
                },
                500: {
                    $ref: "#/components/schemas/InternalServerError"
                }
            }
        }
    }
}