const { z } = require("zod");

const baseSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.email().min(5).max(50),
    password: z.string().min(5).max(70)
})

const updateUserSchema = baseSchema

module.exports = {
    updateUserSchema
}