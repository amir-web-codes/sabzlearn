const { default: mongoose } = require("mongoose")
const sendError = require("../utils/sendError")

const validateId = (req, res, next) => {
    const id = req.params.id

    if (!id) {
        return sendError(res, 401, "no id provided")
    }

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
        return sendError(res, 400, "invalid id")
    }

    next()
}

module.exports = validateId