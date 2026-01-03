const sendSuccess = require("../utils/sendSuccess")
const sendError = require("../utils/sendError")

const userService = require("../services/userService")

async function getUserById(req, res) {
    try {

        const data = await userService.findUserById(req.params.id)

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        res.json({
            success: true,
            message: "user found successfuly",
            data
        })

    } catch (err) {
        console.log(`server error: ${err.stack}`)
        sendError(res, 500, "internal server error")
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
        console.log(`server error: ${err.stack}`)
        sendError(res, 500, "internal server error")
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
        console.log(`server error: ${err.stack}`)
        sendError(res, 500, "internal server error")
    }
}

async function logOut(req, res) {
    try {

    } catch (err) {
        console.log(`server error: ${err.stack}`)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

async function banUser(req, res) {
    try {

        const foundUser = await userService.findUserById(req.params.id)

        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const banDays = req.body.banDays

        if (banDays !== undefined && (!Number.isInteger(Number(banDays)) || banDays < 0)) {
            return res.status(422).json({
                success: false,
                message: "invalid ban days number"
            })
        }

        foundUser.isBanned = true
        foundUser.banReason = req.body.banReason || "no reason"

        if (banDays !== undefined) {
            foundUser.banExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * banDays)
        } else {
            foundUser.banExpiresAt = null
        }

        await foundUser.save()

        return sendSuccess(res, 200, "user banned successfuly")

    } catch (err) {
        console.log(`server error: ${err}`)
        return sendError(res, 500, "internal server error")
    }
}

async function deleteUserById(req, res) {
    try {

    } catch (err) {
        console.log(`server error: ${err.stack}`)
        sendError
    }
}

module.exports = {
    getUserById,
    signUp,
    login,
    logOut,
    banUser,
    deleteUserById
}