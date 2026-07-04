function validator(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const err = new Error("validation failed")
            err.status = 400
            err.errors = result.error.issues
            throw err
        }

        req.body = result.data
        next()
    }
}

module.exports = validator