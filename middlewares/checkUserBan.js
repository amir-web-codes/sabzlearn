const sendError = require("../utils/sendError")
const userService = require("../services/userService")

const checkUserBan = async (req, res, next) => {
    if (!req.user) {
        return sendError(res, 401, "unauthenticated")
    }

    const { id, isBanned, banExpiresAt } = req.user

    if (isBanned) {
        if (banExpiresAt === null) {
            return sendError(res, 403, "you are permanently banned")
        }

        const now = Date.now()
        const expiresAt = new Date(banExpiresAt).getTime()

        if (now < expiresAt) {
            return sendError(res, 403, `you are temporary banned until: ${new Date(banExpiresAt).toISOString()}`)
        }

        if (now > expiresAt) {
            await userService.unBanUser(id)
        }
    }


    next()
}

module.exports = checkUserBan