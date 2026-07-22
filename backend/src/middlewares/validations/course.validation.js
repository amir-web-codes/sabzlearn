const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const baseSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string(),
    price: z.coerce.number().min(0).default(0),
    discountPrecentage: z.coerce.number().min(0).max(100).default(0),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    language: z.enum(["en", "fa"]).default("fa"),
    status: z.enum(["draft", "published", "archived", "closed"]).default("draft"),
    category: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug").optional()
})

const createSchema = baseSchema

const editSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string(),
    price: z.coerce.number().min(0),
    discountPrecentage: z.coerce.number().min(0).max(100),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    language: z.enum(["en", "fa"]),
    status: z.enum(["draft", "published", "archived", "closed"]),
    category: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug")
}).partial()

const getAllCoursesQuerySchema = z.object({
    ...paginationFields(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    language: z.enum(["en", "fa"]).optional(),
    status: z.enum(["draft", "published", "archived", "closed"]).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    ...sortFields(["createdAt", "price", "students", "rating", "title"], "createdAt")
}).refine(
    data => !(data.minPrice !== undefined && data.maxPrice !== undefined) || data.minPrice <= data.maxPrice,
    { message: "minPrice must be less than or equal to maxPrice", path: ["minPrice"] }
)

const getCourseCommentsQuerySchema = z.object({
    ...paginationFields(),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"]).optional(),
    ...sortFields(["createdAt", "rating"], "createdAt")
})

const getCourseStudentsQuerySchema = z.object({
    ...paginationFields(),
    ...sortFields(["createdAt", "lastAccessedAt"], "createdAt")
})

module.exports = {
    createSchema,
    editSchema,
    getAllCoursesQuerySchema,
    getCourseCommentsQuerySchema,
    getCourseStudentsQuerySchema
}