const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const saltRounds = 12

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
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return await userModel.create({
        username,
        email,
        password: hashedPassword,
        role: "user"
    })
}

async function createTokens(user, rememberMe) {
    const accessToken = jwt.sign({ id: user._id, role: user.role, isBanned: user.isBanned, banExpiresAt: user.banExpiresAt }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "5m" })
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_KEY, { expiresIn: rememberMe ? "15d" : "1d" })

    const tokens = await tokenModel.find({ userId: user._id }).sort({ createdAt: 1 })

    const maximumTokens = 2

    if (tokens.length >= maximumTokens) {
        await tokenModel.findByIdAndDelete(tokens[0]._id)
    }

    const hashedToken = await bcrypt.hash(refreshToken, saltRounds)

    await tokenModel.create({
        hashedToken,
        userId: user._id,
        revoked: false
    })

    return { accessToken, refreshToken }
}

async function comparePasswords(password, dbPassword) {
    return await bcrypt.compare(password, dbPassword)
}

async function revokeUserToken(userId) {
    const tokens = await tokenModel.find({ userId: userId })

    tokens.forEach(async token => {
        token.revoked = true
        await token.save()
    })

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

    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        user.password = hashedPassword || user.password
    }

    user.username = username || user.username
    user.email = email || user.email

    await user.save()
}

async function refreshAccessToken(token, rememberMe) {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
        const foundUser = await findUserById(decoded.id)
        const foundToken = await tokenModel.findOne({ userId: decoded.id })

        const compareResult = await bcrypt.compare(token, foundToken.hashedToken)

        if (!compareResult) {
            const err = new Error("error")
            err.status = 403
            throw err
        }

        console.log(foundUser)
        console.log(foundToken)

        foundToken.revoked = true
        await foundToken.save()

        return await createTokens(foundUser, rememberMe)

    } catch (err) {
        err = new Error("invaild or expired token")
        err.status = 403
        throw err
    }

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
    refreshAccessToken
}