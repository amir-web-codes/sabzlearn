const { z } = require("zod")

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

const slugParamSchema = z.object({
    slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug")
}).strict()

const createSchema = z.object({
    name: z.string().trim().min(2).max(50),
    description: z.string().trim().max(1000).default(""),
    parent: z.preprocess(value => value === "" ? null : value, objectIdSchema.nullable().optional()),
    sortOrder: z.coerce.number().int().min(0).default(0),
    status: z.enum(["active", "inactive"]).default("active")
}).strict()

const updateSchema = z.object({
    name: createSchema.shape.name.optional(),
    description: createSchema.shape.description.optional(),
    parent: createSchema.shape.parent,
    sortOrder: createSchema.shape.sortOrder.optional(),
    status: createSchema.shape.status.optional()
}).strict().refine(data => Object.keys(data).length > 0, {
    message: "No fields to update"
})

const getAllQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(100).optional(),
    inactive: z.preprocess(value => value === "true", z.boolean().default(false)),
    sortBy: z.enum(["sortOrder", "createdAt", "updatedAt", "name"]).default("sortOrder"),
    sortOrder: z.enum(["asc", "desc"]).default("asc")
}).strict()

module.exports = {
    createSchema,
    updateSchema,
    slugParamSchema,
    getAllQuerySchema
}