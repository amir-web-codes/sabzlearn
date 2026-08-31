module.exports = {
    CourseListSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Course list sort key. Backend mapping: createdAt -> createdAt, price -> finalPrice, students -> studentsCount, rating -> rating.average, title -> title.",
        schema: {
            type: "string",
            enum: ["createdAt", "price", "students", "rating", "title"],
            default: "createdAt"
        },
        example: "rating"
    },

    CourseLevelFilterParameter: {
        name: "level",
        in: "query",
        required: false,
        schema: {
            $ref: "#/components/schemas/CourseLevel"
        }
    },

    CourseLanguageFilterParameter: {
        name: "language",
        in: "query",
        required: false,
        schema: {
            $ref: "#/components/schemas/CourseLanguage"
        }
    },

    CourseStatusFilterParameter: {
        name: "status",
        in: "query",
        required: false,
        description: "Exact status filter. Non-admin callers may explicitly request only published. Admins may request any CourseStatus, but when status is omitted the backend still defaults to published for admins too.",
        schema: {
            $ref: "#/components/schemas/CourseStatus"
        },
        example: "published"
    },

    CourseCategoryFilterParameter: {
        name: "category",
        in: "query",
        required: false,
        description: "Category slug filter. Matching includes the selected category and all of its descendants. An unknown slug returns 404 category not found.",
        schema: {
            $ref: "#/components/schemas/KebabSlug"
        },
        example: "programming"
    },

    CourseMinPriceParameter: {
        name: "minPrice",
        in: "query",
        required: false,
        description: "Minimum finalPrice (after discount), inclusive. Price-range queries intentionally bypass the Course-list Redis cache.",
        schema: {
            type: "number",
            minimum: 0
        },
        example: 20
    },

    CourseMaxPriceParameter: {
        name: "maxPrice",
        in: "query",
        required: false,
        description: "Maximum finalPrice (after discount), inclusive. When both prices are supplied, minPrice must be <= maxPrice.",
        schema: {
            type: "number",
            minimum: 0
        },
        example: 100
    },

    CourseLessonsIncludedParameter: {
        name: "lessonsIncluded",
        in: "query",
        required: false,
        description: "Must be the literal string true or false. Defaults to true. false omits data.lessons from the response, but the backend still loads lessons to calculate meta.duration.",
        schema: {
            type: "string",
            enum: ["true", "false"],
            default: "true"
        },
        example: "false"
    },

    CourseStudentsSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Sort active enrollments before the controller maps them to user objects. Enrollment metadata itself is not returned.",
        schema: {
            type: "string",
            enum: ["createdAt", "lastAccessedAt"],
            default: "createdAt"
        },
        example: "lastAccessedAt"
    }
}