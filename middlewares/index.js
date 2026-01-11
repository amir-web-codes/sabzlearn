const validateId = require("./validateId")
const checkToken = require("./checkToken")
const checkRoles = require("./checkRoles")
const checkSelfUser = require("./checkSelfUser")
const checkUserBan = require("./checkUserBan")
const loginLimiter = require("./loginLimiter")
const adminLimiter = require("./adminLimiter")
const enrollLimiter = require("./enrollLimiter")
const commentLimiter = require("./commentLimiter")
const checkSelfCourseAuthor = require("./checkSelfCourseAuthor")
const checkSelfCommentAuthor = require("./checkSelfCommentAuthor")


module.exports = {
    validateId,
    checkToken,
    checkRoles,
    checkSelfUser,
    checkUserBan,
    loginLimiter,
    adminLimiter,
    enrollLimiter,
    commentLimiter,
    checkSelfCourseAuthor,
    checkSelfCommentAuthor
}