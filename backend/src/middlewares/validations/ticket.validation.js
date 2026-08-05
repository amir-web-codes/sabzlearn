const { z } = require("zod")
const { paginationFields, sortFields } = require("./common.validation")

const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid MongoDB ObjectId"
);

const baseSchema = z.object({
    title: z.string().min(3).max(150),
    message: z.string().min(1).max(1000),
    assignedToId: objectIdSchema.optional()
})

const createSchema = baseSchema;

const replySchema = baseSchema.pick({
    message: true
})

const changeStatusSchema = z.object({
    newStatus: z.enum(["pending", "closed"])
})

const getUserTicketsQuerySchema = z.object({
    ...paginationFields(),
    status: z.enum(["open", "pending", "closed"]).optional(),
    ...sortFields(["createdAt"], "createdAt")
})

const getAllTicketsQuerySchema = z.object({
    ...paginationFields(),
    status: z.enum(["open", "pending", "closed"]).optional(),
    availableOnly: z.enum(["true", "false"]).default("true"),
    ...sortFields(["createdAt"], "createdAt")
})

module.exports = {
    createSchema,
    replySchema,
    changeStatusSchema,
    getUserTicketsQuerySchema,
    getAllTicketsQuerySchema
}