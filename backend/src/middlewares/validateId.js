const { default: mongoose } = require("mongoose")

const validateId = (req, res, next) => {
    const id = req.params.id

    if (!id) {
        const err = new Error("no id provided")
        err.status = 401
        throw err
    }

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
        const err = new Error("invalid id")
        err.status = 400
        throw err
    }

    next()
}

module.exports = validateId