const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

async function findUserById(userId) {
    const data = await userModel.findById(userId)

    if (!data) {
        const err = new Error("user not found")
        err.status = 404
        throw err
    }

    return data
}

async function findByEmail(email) {
    const data = await userModel.findOne({ email })

    return data
}

async function createUser({ username, email, password }) {

    const today = new Date(Date.now())

    return await userModel.create({
        username,
        email,
        password: password,
        role: "user",
        lastLogin: today
    })
}

async function createTokens(user, rememberMe, deviceId, userAgent, isLogin) {
    const accessToken = jwt.sign({ id: user._id, role: user.role, isBanned: user.isBanned, banExpiresAt: user.banExpiresAt }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "5m" })
    const refreshToken = jwt.sign({ id: user._id, role: user.role, deviceId }, process.env.REFRESH_TOKEN_KEY, { expiresIn: rememberMe ? "15d" : "1d" })

    const tokens = await tokenModel.find({ userId: user._id }).sort({ createdAt: 1 })
    const maximumTokens = 5

    if (tokens.length >= maximumTokens) {
        await tokenModel.findByIdAndDelete(tokens[0]._id)
    }

    const deviceTokens = await tokenModel.find({ userId: user._id, deviceId }).sort({ createdAt: 1 })
    // maximum tokens per device
    const maximumDeviceTokens = 2

    if (deviceTokens.length >= maximumDeviceTokens) {
        await tokenModel.findByIdAndDelete(deviceTokens[0]._id)
    }



    // if it's a login request, add lastLogin Date
    if (isLogin) {
        const today = new Date(Date.now())

        user.lastLogin = today
        await user.save()
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * (rememberMe ? 15 : 1))

    await revokeUserToken(user._id, deviceId)

    await tokenModel.create({
        hashedToken: refreshToken,
        userId: user._id,
        revoked: false,
        deviceId: String(deviceId),
        userAgent,
        expiresAt
    })

    return { accessToken, refreshToken }
}

async function comparePasswords(password, dbPassword) {
    return await bcrypt.compare(password, dbPassword)
}

async function revokeUserToken(userId, deviceId) {

    if (!deviceId) {
        await tokenModel.updateMany({ userId }, { revoked: true })
    } else {
        await tokenModel.updateMany({ userId, deviceId }, { revoked: true })
    }

    return
}

async function banUser(user, banDays, reason = "no reason") {
    user.isBanned = true
    user.banReason = reason

    if (banDays !== undefined) {
        user.banExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * banDays)
    } else {
        user.banExpiresAt = null
    }

    await user.save()
}

async function unBanUser(userId) {
    const foundUser = await findUserById(userId)

    if (!foundUser.isBanned) {
        const err = new Error("this user wasn't ban")
        err.status = 409
        throw err
    }

    foundUser.isBanned = false
    foundUser.banReason = null
    foundUser.banExpiresAt = null

    await foundUser.save()
}

async function deleteUser(userId) {
    const deletedData = await userModel.deleteOne({ _id: userId })

    if (deletedData.deletedCount === 0) {
        const err = new Error("user not found")
        err.status = 404
        throw err
    }

    await tokenModel.deleteMany({ userId: userId })

    return deletedData
}

async function updateUser(user, username, email, password) {

    const foundEmail = await findByEmail(email)

    if (foundEmail && email !== user.email) {
        const err = new Error("email already exists")
        err.status = 403
        throw err
    }

    user.username = username || user.username
    user.email = email || user.email

    await user.save()
}

async function refreshAccessToken(token, rememberMe, userAgent, deviceId) {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
        const foundUser = await findUserById(decoded.id)
        const foundTokens = await tokenModel.find({ userId: decoded.id, deviceId }).sort({ createdAt: -1 })

        if (!foundTokens.length || foundTokens[0].revoked) {
            await revokeUserToken(foundUser._id, deviceId)
            const err = new Error("faked refresh token")
            err.status = 401
            throw err
        }


        const compareResult = await bcrypt.compare(token, foundTokens[0].hashedToken)


        if (!compareResult) {
            const err = new Error("faked refresh token")
            err.status = 401
            throw err
        }

        foundTokens[0].revoked = true
        await foundTokens[0].save()

        return await createTokens(foundUser, rememberMe, deviceId, userAgent)

    } catch (err) {
        if (err.status === 401) {
            throw err
        } else {
            err = new Error("invaild or expired token")
            err.status = 401
            throw err
        }
    }

}

async function changePassword(user, password) {
    revokeUserToken(user._id)

    user.password = password

    await user.save()
}

module.exports = {
    findUserById,
    findByEmail,
    createUser,
    createTokens,
    comparePasswords,
    revokeUserToken,
    banUser,
    unBanUser,
    deleteUser,
    updateUser,
    refreshAccessToken,
    changePassword
}