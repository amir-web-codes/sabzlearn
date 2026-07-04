const jwt = require("jsonwebtoken")

function checkToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "no token provided"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        req.user = decoded

        if (!req.user) {
            throw err
        }

        next()
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "invalid or expired token"
        })
    }
}

module.exports = checkToken