const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

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

const getAllTagsQuerySchema = z.object({
    ...paginationFields(),
    search: z.string().trim().max(100).optional(),
    ...sortFields(["name", "createdAt"], "createdAt")
}).strict()

const getTagCoursesQuerySchema = z.object({
    ...paginationFields(),
    ...sortFields(["createdAt", "price", "students", "rating", "title"], "createdAt")
}).strict()

module.exports = {
    slugParamSchema,
    createSchema,
    updateSchema,
    getTagCoursesQuerySchema,
    getAllTagsQuerySchema
}