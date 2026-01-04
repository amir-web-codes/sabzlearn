const sendError = require("../utils/sendError")

function checkSelfUser(adminAllowed = false) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "unauthenticated"
            })
        }

        const userId = req.user.id.toString()

        if (req.params.id.toString() === userId) {
            return next()
        } else if (adminAllowed && req.user.role === "admin") {
            return next()
        }


        sendError(403, "you don't have permission")
    }
}

module.exports = checkSelfUser