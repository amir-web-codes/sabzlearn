module.exports = {
    LessonNotFound: {
        description: "Lesson not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "lesson not found" }
            }
        }
    },
    CourseNotFound: {
        description: "Course with the given slug not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "course not found" }
            }
        }
    },
    NoAccessToLesson: {
        description: "User is not the publisher of this lesson (and, depending on the route, not an admin either)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have access to this lesson" }
            }
        }
    }
}