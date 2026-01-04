const sendError = require("../utils/sendError")

const checkRoles = (allowedRoles = ["user"]) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "unauthenticated"
            })
        }

        if (allowedRoles.includes(req.user.role)) {
            next()
        } else {
            return sendError(403, "you don't have permission")
        }
    }
}

module.exports = checkRoles