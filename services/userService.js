const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

async function findUserById(id) {
    const data = await userModel.findById(id)
    return data
}

async function findByEmail(email) {
    return await userModel.findOne({ email })
}

async function createUser({ username, email, password }) {
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return await userModel.create({
        username,
        email,
        password: hashedPassword,
        role: "user"
    })
}

async function createTokens(user) {
    const accessToken = jwt.sign({ id: user._id, role: user.role, isBanned: user.isBanned, banExpiresAt: user.banExpiresAt }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_KEY, { expiresIn: "15d" })

    const token = await tokenModel.deleteOne({ userId: user._id })

    const hashedToken = await bcrypt.hash(refreshToken, 12)

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

async function deleteToken(userId) {

}

module.exports = {
    findUserById,
    findByEmail,
    createUser,
    createTokens,
    comparePasswords,
    deleteToken
}