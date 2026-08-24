module.exports = {
    IdParameter: {
        name: "id",
        in: "path",
        description: "MongoDB ObjectId",
        required: true,
        schema: {
            $ref: "#/components/schemas/MongoObjectId"
        },
        example: "6857e4d1e5d82d0d1f5d8c40"
    }
}