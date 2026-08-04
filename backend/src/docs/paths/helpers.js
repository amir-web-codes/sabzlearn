const schemaRef = name => ({ $ref: `#/components/schemas/${name}` })
const responseRef = name => ({ $ref: `#/components/responses/${name}` })
const parameterRef = name => ({ $ref: `#/components/parameters/${name}` })

function jsonResponse(description, schema, example) {
    const media = { schema: typeof schema === "string" ? schemaRef(schema) : schema }
    if (example) media.example = example

    return {
        description,
        content: { "application/json": media }
    }
}

const commonErrors = {
    400: responseRef("FailedValidation"),
    401: responseRef("Unauthorized"),
    403: responseRef("Forbidden"),
    429: responseRef("TooManyRequestsGlobal"),
    500: responseRef("InternalServerError")
}

module.exports = {
    schemaRef,
    responseRef,
    parameterRef,
    jsonResponse,
    commonErrors,
    bearerSecurity: [{ bearerAuth: [] }],
    optionalBearerSecurity: [{}, { bearerAuth: [] }]
}
