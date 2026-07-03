const { z } = require("zod")

const baseSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string(),
    price: z.coerce.number().default(0),
    discountPrice: z.coerce.number().min(0).max(100).default(0),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    language: z.enum(["en", "fa"]).default("fa"),
    status: z.enum(["draft", "published", "archived"]).default("draft")
})

const createSchema = baseSchema

const editSchema = baseSchema.partial()

module.exports = {
    createSchema,
    editSchema
}