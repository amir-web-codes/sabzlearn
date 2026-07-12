module.exports = {
    IdParameter: {
        name: "id",
        in: "path",
        description: "MongoDB ObjectId",
        required: true,
        schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "6857e4d1e5d82d0d1f5d8c40"
        }
    }
}