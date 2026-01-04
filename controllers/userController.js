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

async function signUp(req, res) {
    try {

        const { email } = req.body

        const foundUser = await userService.findByEmail(email)

        if (foundUser) {
            return res.status(409).json({
                success: false,
                message: "email already exists"
            })
        }

        const createdUser = await userService.createUser(req.body)

        const { accessToken, refreshToken } = await userService.createTokens(createdUser)


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/refresh-token",
            maxAge: 1000 * 60 * 60 * 24 * 15
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

                const { accessToken, refreshToken } = await userService.createTokens(foundUser)

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/refresh-token",
                    maxAge: 1000 * 60 * 60 * 24 * 15
                })

                return res.status(201).json({
                    success: true,
                    message: "login successful",
                    accessToken
                })
            }
        }

        res.status(401).json({
            success: false,
            message: "wrong email or password"
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

module.exports = {
    getUserById,
    signUp,
    login,
    logOut,
    banUser,
    getUserProfile,
    deleteUserById,
    deleteUserProfile
}