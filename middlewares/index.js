const validateId = require("./validateId")
const checkToken = require("./checkToken")
const checkRoles = require("./checkRoles")
const checkSelfUser = require("./checkSelfUser")
const checkUserBan = require("./checkUserBan")
const loginLimiter = require("./loginLimiter")
const adminLimiter = require("./adminLimiter")
const checkSelfCourseAuthor = require("./checkSelfCourseAuthor")

module.exports = {
    validateId,
    checkToken,
    checkRoles,
    checkSelfUser,
    checkUserBan,
    loginLimiter,
    adminLimiter,
    checkSelfCourseAuthor
}