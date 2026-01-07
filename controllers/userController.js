const sendError = require("../utils/sendError")
const asyncWrapper = require("../utils/asyncWrapper")
const { randomUUID } = require("crypto")

const userService = require("../services/userService")

async function getUserById(req, res) {
    const foundUser = await userService.findUserById(req.params.id)

    res.json({
        success: true,
        message: "user found successfully",
        data: foundUser
    })
}

async function deleteUserById(req, res) {
    await userService.deleteUser(req.params.id)

    res.json({
        success: true,
        message: "user deleted successfully"
    })
}

async function signUp(req, res) {
    const { email } = req.body

    const foundUser = await userService.findByEmail(email)

    if (foundUser) {
        return sendError(409, "email already exists")
    }

    const createdUser = await userService.createUser(req.body)

    const rememberMe = req.body.rememberMe
    const userAgent = req.headers["user-agent"]
    const deviceId = randomUUID()

    const { accessToken, refreshToken } = await userService.createTokens(createdUser, rememberMe, deviceId, userAgent)


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/users/refresh-token",
        maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
    })

    res.cookie("deviceId", deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 365
    })

    res.status(201).json({
        success: true,
        message: "user signed up successfully",
        accessToken
    })
}

async function login(req, res) {
    const foundUser = await userService.findByEmail(req.body.email)

    if (foundUser) {
        const result = await userService.comparePasswords(req.body.password, foundUser.password)

        if (result) {

            const rememberMe = req.body.rememberMe
            const userAgent = req.headers["user-agent"]
            let deviceId = req.cookies.deviceId

            if (!deviceId) {
                deviceId = randomUUID()
            }

            const { accessToken, refreshToken } = await userService.createTokens(foundUser, rememberMe, deviceId, userAgent, true)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/users/refresh-token",
                maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
            })

            res.cookie("deviceId", deviceId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 365
            })

            return res.status(201).json({
                success: true,
                message: "login successful",
                accessToken
            })
        }
    }

    sendError(401, "wrong email or password")
}

async function logOut(req, res) {
    const deviceId = req.cookies.deviceId

    if (!deviceId) {
        sendError(403, "you're not logged in")
    }

    await userService.revokeUserToken(req.user.id, deviceId)

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/users/refresh-token",
    })

    res.json({
        success: true,
        message: "user logged out successfully"
    })
}

async function banUser(req, res) {
    const foundUser = await userService.findUserById(req.params.id)

    const banDays = req.body.banDays

    if (banDays !== undefined && (!Number.isInteger(Number(banDays)) || banDays < 0)) {
        return sendError(422, "invalid ban days")
    }

    await userService.banUser(foundUser, banDays, req.body.banReason)

    return res.json({
        success: true,
        message: "user banned successfully"
    })
}

async function unBanUser(req, res) {
    await userService.unBanUser(req.params.id)

    res.json({
        success: true,
        message: "user unbanned successfully"
    })
}

async function getUserProfile(req, res) {
    const foundUser = await userService.findUserById(req.user.id)

    res.json({
        success: true,
        data: foundUser
    })
}

async function deleteUserProfile(req, res) {
    await userService.deleteUser(req.user.id)

    res.json({
        success: true,
        message: "user deleted successfully"
    })
}

async function updateUserProfile(req, res) {
    const { username, email, password } = req.body

    const foundUser = await userService.findUserById(req.user.id)

    await userService.updateUser(foundUser, username, email)

    res.json({
        success: true,
        message: "user updated successfully"
    })
}

async function refreshToken(req, res) {
    const oldToken = req.cookies.refreshToken

    if (!oldToken) {
        sendError(403, "token not available or expired")
    }


    const deviceId = req.cookies.deviceId
    const rememberMe = req.body.rememberMe
    const userAgent = req.headers["user-agent"]

    if (!deviceId) {
        sendError(403, "you're not logged in")
    }

    const { accessToken, refreshToken } = await userService.refreshAccessToken(oldToken, rememberMe, userAgent, deviceId)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/users/refresh-token",
        maxAge: req.body.rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
    })

    res.json({
        success: true,
        accessToken
    })
}

async function changeUserPassword(req, res) {
    const foundUser = await userService.findUserById(req.user.id)

    await userService.changePassword(foundUser, req.body.password)

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/users/refresh-token"
    })

    res.json({
        success: true,
        message: "password changed successfully, please Login again",
    })
}

module.exports = {
    getUserById: asyncWrapper(getUserById),
    deleteUserById: asyncWrapper(deleteUserById),
    signUp: asyncWrapper(signUp),
    login: asyncWrapper(login),
    logOut: asyncWrapper(logOut),
    banUser: asyncWrapper(banUser),
    unBanUser: asyncWrapper(unBanUser),
    getUserProfile: asyncWrapper(getUserProfile),
    deleteUserProfile: asyncWrapper(deleteUserProfile),
    updateUserProfile: asyncWrapper(updateUserProfile),
    refreshToken: asyncWrapper(refreshToken),
    changeUserPassword: asyncWrapper(changeUserPassword)
}