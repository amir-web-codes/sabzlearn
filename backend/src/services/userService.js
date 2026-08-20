const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const enrollmentModel = require("../models/enrollmentModel")
const commentModel = require("../models/commentModel")
const requestModel = require("../models/requestModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const { client } = require("../configs/redis")
const { uploadImage, deleteFile } = require("./fileService")
const { buildCacheKey, resolveTTL } = require("../utils/listCache")

async function findUserById(userId) {
    const data = await userModel.findById(userId).select("-password").populate("bannedBy", "username email")

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

async function uploadAvatar(req, file, user) {
    let uploadedFile;

    try {
        uploadedFile = await uploadImage(file, "sabzlearn/avatars")

        const oldPublicId = user.avatar.publicId

        user.avatar = {
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id
        }

        req.uploadedFile = uploadedFile

        await user.save()

        if (oldPublicId) {
            await deleteFile(oldPublicId, "image")
        }

        return user
    } catch (err) {
        if (uploadedFile) {
            await deleteFile(uploadedFile.public_id).catch(() => { })
        }
        err.status = err.status || 500
        throw err
    }
}

async function createUser(req, { username, email, password }, file) {
    const today = new Date(Date.now())

    const createdUser = await userModel.create({
        username,
        email,
        password: password,
        role: "user",
        lastLogin: today
    })

    if (file) {
        try {
            await uploadAvatar(req, file, createdUser)
        } catch (err) {
            console.error("avatar upload failed during signup, continuing with default avatar:", err)
        } finally {
            delete req.uploadedFile
        }
    }

    return createdUser
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
    const maximumDeviceTokens = 2

    if (deviceTokens.length >= maximumDeviceTokens) {
        await tokenModel.findByIdAndDelete(deviceTokens[0]._id)
    }

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

async function banUser(user, banDays, reason = "no reason", userId) {
    if (user.role === "admin") {
        const err = new Error("you can't ban an admin")
        err.status = 403
        throw err
    }

    user.isBanned = true
    user.banReason = reason
    user.bannedBy = userId

    if (banDays == undefined || banDays === 0) {
        user.banExpiresAt = null
    } else {
        user.banExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * banDays)
    }

    await user.save()
}

async function unBanUser(bannedId) {
    const foundUser = await findUserById(bannedId)

    if (!foundUser.isBanned) {
        const err = new Error("this user is not ban")
        err.status = 409
        throw err
    }

    foundUser.isBanned = false
    foundUser.banReason = null
    foundUser.banExpiresAt = null
    foundUser.bannedBy = null

    await foundUser.save()
}

async function deleteUser(userId, deletedById) {
    const deletedData = await userModel.findOneAndUpdate(
        { _id: userId, role: { $ne: "admin" }, isDeleted: false },
        {
            $set: {
                isDeleted: true,
                deletedBy: deletedById,
                deletedAt: new Date(Date.now())
            }
        },
        { new: true }
    )

    if (!deletedData) {
        const err = new Error("user not found or was an admin")
        err.status = 404
        throw err
    }

    await tokenModel.deleteMany({ userId: userId })
    await deleteUserAvatar(deletedData)

    return deletedData
}

async function updateUser(req, user, { username, email }, file) {
    if (email) {
        const foundEmail = await findByEmail(email)

        if (foundEmail && email !== user.email) {
            const err = new Error("email already exists")
            err.status = 409
            throw err
        }

        user.email = email
    }

    if (username) {
        user.username = username
    }

    if (file) {
        await uploadAvatar(req, file, user)
        delete req.uploadedFile
    } else {
        await user.save()
    }
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
            err = new Error("invalid or expired token")
            err.status = 403
            throw err
        }
    }
}

async function changePassword(user, password) {
    await revokeUserToken(user._id)
    user.password = password
    await user.save()
}

async function findUserCourses(userId, page, limit, sort = {}) {
    const { sortBy = "createdAt", sortOrder = "desc" } = sort
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const key = buildCacheKey(`courses:users:${userId}:enrolled`, { page, limit, sortBy, sortOrder })
    const cached = await client.get(key)

    let data = cached ? JSON.parse(cached) : null
    let totalNumber = 0

    if (data) {
        totalNumber = Number(await client.get(`${key}:totalNumber`))
        return { data, totalNumber }
    }

    data = await enrollmentModel
        .find({ userId })
        .select("courseId")
        .populate("courseId", "title slug price discountPrecentage")
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    totalNumber = await enrollmentModel.countDocuments({ userId })

    const hasNonDefaultFilters = sortBy !== "createdAt" || sortOrder !== "desc"
    await client.set(key, JSON.stringify(data), { EX: resolveTTL(hasNonDefaultFilters) })
    await client.set(`${key}:totalNumber`, totalNumber, { EX: resolveTTL(hasNonDefaultFilters) })

    return { data, totalNumber }
}

async function findUserComments(userId, page, limit, filters = {}, sort = {}) {
    const { rating } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const query = { authorId: userId }
    if (rating) query.rating = rating

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await commentModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await commentModel.countDocuments(query)
    return { data, totalNumber }
}

async function getUserDashboard(userId) {
    const foundUser = await userModel.findById(userId).select("username email role isBanned lastLogin createdAt").lean()

    if (!foundUser) {
        const err = new Error("user not found")
        err.status = 404
        throw err
    }

    const [enrolledCoursesCount, commentsCount, pendingRequestsCount] = await Promise.all([
        enrollmentModel.countDocuments({ userId }),
        commentModel.countDocuments({ authorId: userId }),
        requestModel.countDocuments({ userId, status: "pending" })
    ])

    return {
        user: {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
            isBanned: foundUser.isBanned,
            lastLogin: foundUser.lastLogin,
            memberSince: foundUser.createdAt
        },
        stats: {
            enrolledCourses: enrolledCoursesCount,
            commentsCount,
            pendingRequests: pendingRequestsCount
        },
        overview: {
            accountStatus: foundUser.isBanned ? "banned" : "active",
            hasPendingRoleRequest: pendingRequestsCount > 0
        }
    }
}

async function changeRole(userId, role) {
    const user = await userModel.findOneAndUpdate(
        { _id: userId, role: { $ne: "admin" } },
        { $set: { role } },
        { new: true }
    );

    if (!user) {
        const exists = await userModel.exists({ _id: userId });

        if (!exists) {
            const err = new Error("user not found");
            err.status = 404;
            throw err;
        }

        const err = new Error("you can't change another admin role");
        err.status = 403;
        throw err;
    }

    return user;
}

async function requestRole(userId, currentRole, role) {
    let createdRequest

    try {
        createdRequest = await requestModel.create({
            userId,
            requestedRole: role,
            currentRole,
            status: "pending"
        })
    } catch (err) {
        if (err?.code === 11000) {
            const conflict = new Error(
                "you already have a pending request"
            )

            conflict.status = 403
            throw conflict
        }

        throw err
    }

    const processedRequests = await requestModel.find({
        userId,
        _id: {
            $ne: createdRequest._id
        },
        status: {
            $ne: "pending"
        }
    }).sort({ createdAt: 1 }).select("_id").lean()

    const excess = processedRequests.length - 2

    if (excess > 0) {
        const idsToDelete = processedRequests
            .slice(0, excess)
            .map(request => request._id)

        await requestModel.deleteMany({
            _id: {
                $in: idsToDelete
            }
        })
    }

    return createdRequest
}

async function findPendingRequests(page, limit, sort = {}) {
    const { sortBy = "createdAt", sortOrder = "desc" } = sort
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await requestModel
        .find({ status: "pending" })
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

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
    const foundRequest = await requestModel.findOneAndUpdate(
        {
            _id: requestId,
            status: "pending"
        },
        {
            $set: {
                status: "rejected",
                processedBy: adminId,
                processedAt: new Date()
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!foundRequest) {
        res.status(404).json({
            success: false,
            message: "no pending request found"
        })
    }
}

async function getAllRequests(page, limit, filters = {}, sort = {}) {
    const { status, requestedRole } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const query = {}
    if (status) query.status = status
    if (requestedRole) query.requestedRole = requestedRole

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await requestModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await requestModel.countDocuments(query)

    return { data, totalNumber }
}

async function findRequestById(requestId) {
    const data = await requestModel.findById(requestId).populate("processedBy userId", "username email").lean()

    if (!data) {
        const err = new Error("request not found")
        err.status = 404
        throw err
    }

    return data
}

async function checkDeletedUser(user) {
    if (user.isDeleted) {
        await user.populate("deletedBy", "username email")
        const err = new Error(`user deleted`)
        err.status = 404
        err.details = {
            deletedBy: user.deletedBy,
            deletedAt: user.deletedAt
        }
        throw err
    }
}

async function deleteUserAvatar(user) {
    if (user.avatar.publicId) {
        await deleteFile(user.avatar.publicId, "image")
    }

    user.avatar.url = "/images/default-avatar.png"
    user.avatar.publicId = null

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
    changePassword,
    findUserCourses,
    findUserComments,
    getUserDashboard,
    changeRole,
    requestRole,
    findPendingRequests,
    acceptRequest,
    rejectRequest,
    getAllRequests,
    findRequestById,
    checkDeletedUser,
    deleteUserAvatar
}