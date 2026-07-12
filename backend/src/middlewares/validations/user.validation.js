const { z } = require("zod");

const baseSchema = z.object({
    username: z.string().trim().min(3).max(30),
    email: z.email().trim().toLowerCase().min(5).max(50),
    password: z.string().min(5).max(70)
})


const signUpSchema = baseSchema.extend({
    rememberMe: z.boolean().default(false)
})

const loginSchema = baseSchema.pick({
    email: true,
    password: true
}).extend({
    rememberMe: z.boolean().default(false)
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
    banDays: z.coerce.number().min(0).default(0)
})

const refreshTokenSchema = z.object({
    rememberMe: z.boolean().default(false)
})

const changeRoleSchema = z.object({
    newRole: z.enum(["user", "teacher", "admin"])
})

module.exports = {
    signUpSchema,
    loginSchema,
    changePasswordSchema,
    updateUserSchema,
    requestRoleSchema,
    banUserSchema,
    refreshTokenSchema,
    changeRoleSchema
}