const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const baseSchema = z.object({
    title: z.string().min(5).max(150),
    description: z.string(),
    duration: z.coerce.number().default(0),
    order: z.coerce.number().optional()
})

const createSchema = baseSchema;

const editSchema = baseSchema.partial().extend({
    removeVideo: z.enum(["true", "false"]).optional()
})

const getAllLessonsQuerySchema = z.object({
    ...paginationFields(),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid courseId").optional(),
    ...sortFields(["order", "duration", "createdAt"], "order")
})

const getCourseLessonsQuerySchema = z.object({
    ...paginationFields(),
    ...sortFields(["order", "duration", "createdAt"], "order")
})



module.exports = {
    createSchema,
    editSchema,
    getAllLessonsQuerySchema,
    getCourseLessonsQuerySchema
}