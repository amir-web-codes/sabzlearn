const sendError = require("../utils/sendError")

const userService = require("../services/userService")

async function getUserById(req, res) {
    try {

        const foundUser = await userService.findUserById(req.params.id)

        res.json({
            success: true,
            message: "user found successfuly",
            data: foundUser
        })


    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function deleteUserById(req, res) {
    try {

        await userService.deleteUser(req.params.id)

        res.json({
            success: true,
            message: "user deleted successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function signUp(req, res) {
    try {

        const { email } = req.body

        const foundUser = await userService.findByEmail(email)

        if (foundUser) {
            return sendError(409, "email already exists")
        }

        const createdUser = await userService.createUser(req.body)

        const rememberMe = req.body.rememberMe

        const { accessToken, refreshToken } = await userService.createTokens(createdUser, rememberMe)


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/users/refresh-token",
            maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
        })

        res.status(201).json({
            success: true,
            message: "user signed up successfuly",
            accessToken
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function login(req, res) {
    try {

        const foundUser = await userService.findByEmail(req.body.email)

        if (foundUser) {
            const result = await userService.comparePasswords(req.body.password, foundUser.password)

            if (result) {

                const rememberMe = req.body.rememberMe

                const { accessToken, refreshToken } = await userService.createTokens(foundUser)

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/users/refresh-token",
                    maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
                })

                return res.status(201).json({
                    success: true,
                    message: "login successful",
                    accessToken
                })
            }
        }

        sendError(401, "wrong email or password")

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function logOut(req, res) {
    try {

        await userService.revokeUserToken(req.user.id)

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/refresh-token",
        })

        res.json({
            success: true,
            message: "user logged out successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function banUser(req, res) {
    try {

        const foundUser = await userService.findUserById(req.params.id)

        const banDays = req.body.banDays

        if (banDays !== undefined && (!Number.isInteger(Number(banDays)) || banDays < 0)) {
            return sendError(422, "invalid ban days")
        }

        await userService.banUser(foundUser, banDays, req.body.banReason)

        return res.json({
            success: true,
            message: "user banned successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function unBanUser(req, res) {
    try {

        await userService.unBanUser(req.params.id)

        res.json({
            success: true,
            message: "user unbanned successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function getUserProfile(req, res) {
    try {

        const foundUser = await userService.findUserById(req.user.id)

        res.json({
            success: true,
            data: foundUser
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function deleteUserProfile(req, res) {
    try {

        await userService.deleteUser(req.user.id)

        res.json({
            success: true,
            message: "user deleted successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function updateUserProfile(req, res) {
    try {

        const { username, email, password } = req.body

        const foundUser = await userService.findUserById(req.user.id)

        await userService.updateUser(foundUser, username, email, password)

        res.json({
            success: true,
            message: "user updated successfuly"
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

async function refreshToken(req, res) {
    try {
        const oldToken = req.cookies.refreshToken

        if (!oldToken) {
            sendError(403, "token not available or expired")
        }

        const { accessToken, refreshToken } = await userService.refreshAccessToken(oldToken, req.query.rememberMe)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/users/refresh-token",
            maxAge: req.query.rememberMe ? 1000 * 60 * 60 * 24 * 15 : 1000 * 60 * 60 * 24 * 1
        })

        res.json({
            success: true,
            accessToken
        })

    } catch (err) {
        sendError(err.status || 500, err.message)
    }
}

module.exports = {
    getUserById,
    deleteUserById,
    signUp,
    login,
    logOut,
    banUser,
    unBanUser,
    getUserProfile,
    deleteUserProfile,
    updateUserProfile,
    refreshToken
}