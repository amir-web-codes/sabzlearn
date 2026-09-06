const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")

function checkTokenOptional(req, res, next) {
    const header = req.headers.authorization
    const token = header && header.split(" ")[1]

    if (!token) {
        req.user = null
        return next()
    }

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        req.user = decoded

        next()

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "token has expired"
            })

        } else if (err instanceof jwt.NotBeforeError) {
            return res.status(401).json({
                success: false,
                message: "token is not active yet"
            })

        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "invalid token"
            })
        }

        logger.error({ err }, "unexpected error while verifying JWT")

        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

module.exports = checkTokenOptional