const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const slugSchema = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug")

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

const tagsSchema = z.array(objectIdSchema).max(5, "a course can have at most 5 tags")
    .refine(
        tags =>
            new Set(
                tags.map(tag => tag.toLowerCase())
            ).size === tags.length,
        "duplicate tags are not allowed"
    )

const baseSchema = z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().min(1, "description is required"),
    price: z.coerce.number().min(0).default(0),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    language: z.enum(["en", "fa"]).default("fa"),
    status: z.enum(["draft", "published", "archived", "closed"]).default("draft"),
    category: slugSchema.optional(),
    tags: tagsSchema.optional()
})

const createSchema = baseSchema

const editSchema = z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().min(1, "description is required"),
    price: z.coerce.number().min(0),
    discountPercentage: z.coerce.number().min(0).max(100),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    language: z.enum(["en", "fa"]),
    status: z.enum(["draft", "published", "archived", "closed"]),
    category: slugSchema,
    tags: tagsSchema
}).partial()

const getAllCoursesQuerySchema = z.object({
    ...paginationFields(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    language: z.enum(["en", "fa"]).optional(),
    status: z.enum(["draft", "published", "archived", "closed"]).optional(),
    category: slugSchema.optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    ...sortFields(["createdAt", "price", "students", "rating", "title"], "createdAt")
}).refine(
    data => !(data.minPrice !== undefined && data.maxPrice !== undefined) || data.minPrice <= data.maxPrice,
    {
        message: "minPrice must be less than or equal to maxPrice",
        path: ["minPrice"]
    }
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

const getCourseDetailsQuerySchema = z.object({
    lessonsIncluded: z.enum(["true", "false"]).default("true").transform(value => value === "true")
})

module.exports = {
    createSchema,
    editSchema,
    getAllCoursesQuerySchema,
    getCourseCommentsQuerySchema,
    getCourseStudentsQuerySchema,
    getCourseDetailsQuerySchema
}