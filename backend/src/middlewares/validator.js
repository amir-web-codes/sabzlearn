function validator(schema, source = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[source])

        if (!result.success) {
            const err = new Error("validation failed")
            err.status = 400
            err.errors = result.error.issues
            throw err
        }

        if (source === "query") {
            return next()
        }
        req[source] = result.data
        next()
    }
}

module.exports = validator