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
            const err = new Error("you don't have permission")
            err.status = 403
            throw err
        }
    }
}

module.exports = checkRoles