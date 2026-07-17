const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const baseSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string(),
    price: z.coerce.number().default(0),
    discountPrice: z.coerce.number().min(0).max(100).default(0),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    language: z.enum(["en", "fa"]).default("fa"),
    status: z.enum(["draft", "published", "archived", "closed"]).default("draft")
})

const createSchema = baseSchema

const editSchema = baseSchema.partial()

const getAllCoursesSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),
        search: z.string().trim().min(1).max(100).optional(),
        level: z.string().trim().optional(),
        language: z.string().trim().optional(),
        status: z.string().trim().optional(),
        minPrice: z.coerce.number().nonnegative().optional(),
        maxPrice: z.coerce.number().nonnegative().optional(),
        sortBy: z.enum(["createdAt", "price", "students", "rating", "title"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc")
    }).refine(
        data => !(data.minPrice !== undefined && data.maxPrice !== undefined) || data.minPrice <= data.maxPrice,
        { message: "minPrice must be less than or equal to maxPrice", path: ["minPrice"] }
    )
}).optional()

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
    getAllCoursesSchema,
    getAllCoursesQuerySchema,
    getCourseCommentsQuerySchema,
    getCourseStudentsQuerySchema
}