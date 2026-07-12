const { z } = require("zod")

const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid MongoDB ObjectId"
);

const baseSchema = z.object({
    title: z.string().min(3).max(150),
    message: z.string().max(1000),
    assignedToId: objectIdSchema.optional()
})

const createSchema = baseSchema;

const replySchema = baseSchema.pick({
    message: true
})

const changeStatusSchema = z.object({
    newStatus: z.enum(["pending", "closed"])
})

module.exports = {
    createSchema,
    replySchema,
    changeStatusSchema
}