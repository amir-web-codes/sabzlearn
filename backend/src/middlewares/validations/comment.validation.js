const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const baseSchema = z.object({
    title: z.string().min(3).max(60),
    text: z.string().min(3).max(300),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"]).default("Medium")
})

const createSchema = baseSchema

const updateSchema = z.object({
    title: z.string().min(3).max(60),
    text: z.string().min(3).max(300),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"])
}).partial()

const getUserCommentsQuerySchema = z.object({
    ...paginationFields(),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"]).optional(),
    ...sortFields(["createdAt", "rating"], "createdAt")
})

module.exports = {
    createSchema,
    updateSchema,
    getUserCommentsQuerySchema
}