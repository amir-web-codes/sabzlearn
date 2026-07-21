const { z } = require("zod")

const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid MongoDB ObjectId"
);

const baseSchema = z.object({
    name: z.string().trim().min(2).max(50),
    description: z.string().default(""),
    parent: objectIdSchema.optional(),
    sortOrder: z.coerce.number().default(0),
    status: z.enum(["active", "inactive"]).default("active")
})

const createSchema = baseSchema

module.exports = {
    createSchema
}