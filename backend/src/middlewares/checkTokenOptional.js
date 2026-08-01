const jwt = require("jsonwebtoken")

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
        res.status(401).json({
            success: false,
            message: "invalid or expired token"
        })
    }
}

module.exports = checkTokenOptional