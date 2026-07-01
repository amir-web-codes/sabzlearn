function validator(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const err = new Error("validation failed")
            err.status = 400
            throw err
        }

        next()
    }
}

module.exports = validator