const { z } = require("zod")

const baseSchema = z.object({
    title: z.string().min(3).max(60),
    text: z.string().min(3).max(300),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"]).default("Medium")
})

const createSchema = baseSchema

const updateSchema = baseSchema.partial()

module.exports = {
    createSchema,
    updateSchema
}