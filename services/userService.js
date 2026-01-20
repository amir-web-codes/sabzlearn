const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const enrollmentModel = require("../models/enrollmentModel")
const commentModel = require("../models/commentModel")
const requestModel = require("../models/requestModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


async function findUserById(userId) {
    const data = await userModel.findById(userId).select("-password")

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

    if (user.role === "admin") {
        const err = new Error("you can't ban an admin")
        err.status = 403
        throw err
    }

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

async function findUserCourses(userId, page, limit) {
    const data = await enrollmentModel.find({ userId }).select("courseId").populate("courseId", "title slug price").skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await enrollmentModel.countDocuments({ userId })
    return { data, totalNumber }
}

async function findUserComments(userId, page, limit) {
    const data = await commentModel.find({ authorId: userId }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await commentModel.countDocuments({ authorId: userId })
    return { data, totalNumber }
}

async function changeRole(userId, role) {
    const user = await findUserById(userId)

    const availableRoles = ["user", "teacher", "admin"]

    if (availableRoles.includes(role)) {
        if (user.role === "admin") {
            const err = new Error("you can't change another admin role")
            err.status = 403
            throw err
        }

        user.role = role
        await user.save()
    } else {
        const err = new Error("role is not available")
        err.status = 422
        throw err
    }

    return user
}

async function requestRole(userId, currentRole, role) {
    const availableRoles = ["user", "teacher"]

    if (availableRoles.includes(role)) {

        const userRequests = await requestModel.find({ userId }).sort({ createdAt: 1 })

        if (userRequests.length >= 3) {
            await requestModel.findByIdAndDelete(userRequests[0]._id)
        }

        const isExists = await requestModel.exists({ userId, status: "pending" })
        if (!isExists) {
            return await requestModel.create({
                userId,
                requestedRole: role,
                currentRole,
                status: "pending"
            })
        } else {
            const err = new Error("you already have a pending request")
            err.status = 403
            throw err
        }

    } else {
        const err = new Error("requested role not available")
        err.status = 422
        throw err
    }
}

async function findPendingRequests(page, limit) {
    const data = await requestModel.find({ status: "pending" }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await requestModel.countDocuments({ status: "pending" })

    return { data, totalNumber }
}

async function checkPendingRequest(requestId) {
    const foundRequest = await requestModel.findById(requestId)

    if (!foundRequest) {
        const err = new Error("request not found")
        err.status = 404
        throw err
    }

    if (foundRequest.status !== "pending") {
        const err = new Error("this request has already been processed")
        err.status = 403
        throw err
    }

    return foundRequest
}

async function acceptRequest(adminId, requestId) {
    const foundRequest = await checkPendingRequest(requestId)
    const foundUser = await findUserById(foundRequest.userId)

    foundRequest.status = "accepted"
    foundRequest.processedBy = adminId
    foundRequest.processedAt = new Date()
    await foundRequest.save()

    foundUser.role = foundRequest.requestedRole
    await foundUser.save()

}

async function rejectRequest(adminId, requestId) {
    const foundRequest = await checkPendingRequest(requestId)

    foundRequest.status = "rejected"
    foundRequest.processedBy = adminId
    foundRequest.processedAt = new Date()
    await foundRequest.save()
}

async function getAllRequests(page, limit) {
    const data = await requestModel.find().skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await requestModel.countDocuments()

    return { data, totalNumber }
}

async function findRequestById(requestId) {
    const data = requestModel.findById(requestId).populate("processedBy userId", "username email").lean()

    return data
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
    changePassword,
    findUserCourses,
    findUserComments,
    changeRole,
    requestRole,
    findPendingRequests,
    acceptRequest,
    rejectRequest,
    getAllRequests,
    findRequestById
}