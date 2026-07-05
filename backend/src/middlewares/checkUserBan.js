const userService = require("../services/userService")

const checkUserBan = async (req, res, next) => {
    if (!req.user) {
        const err = new Error("unauthenticated")
        err.status = 401
        throw err
    }

    const { id, isBanned, banExpiresAt } = req.user

    if (isBanned) {
        const foundUser = await userService.findUserById(id)

        if (banExpiresAt === null) {
            const err = new Error(`you are permanently banned. Reason: ${foundUser.banReason}`)
            err.status = 403
            throw err
        }

        const now = Date.now()
        const expiresAt = new Date(banExpiresAt).getTime()

        if (now < expiresAt) {
            const err = new Error(`you are temporary banned until: ${new Date(banExpiresAt).toISOString()}. Reason: ${foundUser.banReason}`)
            err.status = 403
            throw err
        }


        if (foundUser.isBanned && now > expiresAt) {
            await userService.unBanUser(id)
        }
    }


    next()
}

module.exports = checkUserBan