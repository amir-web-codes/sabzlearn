const { z } = require("zod");
const { paginationFields, sortFields } = require("./common.validation")

const formBoolean = z.preprocess((value) => {
    if (value === undefined) return false;

    if (typeof value === "boolean") {
        return value;
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
}, z.boolean());

const baseSchema = z.object({
    username: z.string().trim().min(3).max(30),
    email: z.email().trim().toLowerCase().min(5).max(50),
    password: z.string().min(8).max(70)
})


const signUpSchema = baseSchema.extend({
    rememberMe: formBoolean
})

const loginSchema = baseSchema.pick({
    email: true,
    password: true
}).extend({
    rememberMe: formBoolean
})

const changePasswordSchema = baseSchema.pick({
    password: true
})


const updateUserSchema = baseSchema.pick({
    username: true,
    email: true
}).partial()

const requestRoleSchema = z.object({
    newRole: z.enum(["user", "teacher", "admin"])
})

const banUserSchema = z.object({
    banDays: z.coerce.number().min(0).default(0),
    banReason: z.string().max(200).default(null)
})

const refreshTokenSchema = z.object({
    rememberMe: formBoolean
})

const changeRoleSchema = z.object({
    newRole: z.enum(["user", "teacher", "admin"])
})

const getUserTicketsQuerySchema = z.object({
    ...paginationFields(),
    status: z.enum(["open", "pending", "closed"]).optional(),
    ...sortFields(["createdAt"], "createdAt")
})


const getAllRequestsQuerySchema = z.object({
    ...paginationFields(),
    status: z.enum(["pending", "accepted", "rejected"]).optional(),
    requestedRole: z.enum(["user", "teacher", "admin"]).optional(),
    ...sortFields(["createdAt"], "createdAt")
})

const getPendingRequestsQuerySchema = z.object({
    ...paginationFields(),
    ...sortFields(["createdAt"], "createdAt")
})

const getUserCoursesQuerySchema = z.object({
    ...paginationFields(),
    ...sortFields(["createdAt"], "createdAt")
})

const getUserCommentsQuerySchema = z.object({
    ...paginationFields(),
    rating: z.enum(["Very Bad", "Bad", "Medium", "Good", "Very Good"]).optional(),
    ...sortFields(["createdAt", "rating"], "createdAt")
})

module.exports = {
    signUpSchema,
    loginSchema,
    changePasswordSchema,
    updateUserSchema,
    requestRoleSchema,
    banUserSchema,
    refreshTokenSchema,
    changeRoleSchema,
    getUserTicketsQuerySchema,
    getAllRequestsQuerySchema,
    getPendingRequestsQuerySchema,
    getUserCoursesQuerySchema,
    getUserCommentsQuerySchema
}