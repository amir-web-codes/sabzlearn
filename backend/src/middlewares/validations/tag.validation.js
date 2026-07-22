const { z } = require("zod")

const slugParamSchema = z.object({
    slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug")
}).strict()

const createSchema = z.object({
    name: z.string().trim().min(2).max(50)
}).strict()

const updateSchema = z.object({
    name: createSchema.shape.name.optional()
}).strict().refine(data => Object.keys(data).length > 0, {
    message: "No fields to update"
})

const getTagCoursesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(["createdAt", "price", "students", "rating", "title"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict()

module.exports = {
    slugParamSchema,
    createSchema,
    updateSchema,
    getTagCoursesQuerySchema
}