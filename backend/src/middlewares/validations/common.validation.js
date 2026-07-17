const { z } = require("zod")

function paginationFields() {
    return {
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20)
    }
}

function sortFields(allowedFields, defaultField) {
    return {
        sortBy: z.enum(allowedFields).default(defaultField),
        sortOrder: z.enum(["asc", "desc"]).default("desc")
    }
}

module.exports = {
    paginationFields,
    sortFields
}