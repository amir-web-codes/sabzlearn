const { z } = require("zod")

const baseSchema = z.object({
    title: z.string().min(5).max(150),
    description: z.string(),
    duration: z.number().default(0),
    order: z.number().optional()
})

const createSchema = baseSchema;

const editSchema = baseSchema.partial()

module.exports = {
    createSchema,
    editSchema
}