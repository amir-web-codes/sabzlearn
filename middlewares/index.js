const validateId = require("./validateId")
const checkToken = require("./checkToken")
const checkRoles = require("./checkRoles")
const checkSelfUser = require("./checkSelfUser")
const checkUserBan = require("./checkUserBan")
const checkSelfCourseAuthor = require("./checkSelfCourseAuthor")
const checkSelfCommentAuthor = require("./checkSelfCommentAuthor")
const checkSelfLessonAuthor = require("./checkSelfLessonAuthor")
const limiters = require("./Limiters")


module.exports = {
    validateId,
    checkToken,
    checkRoles,
    checkSelfUser,
    checkUserBan,
    checkSelfCourseAuthor,
    checkSelfCommentAuthor,
    checkSelfLessonAuthor,
    limiters
}