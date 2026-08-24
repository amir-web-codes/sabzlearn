module.exports = {
    CategorySlugParameter: {
        name: "slug",
        in: "path",
        required: true,
        description: "Category slug. Validation trims the incoming value, requires 2-100 characters, and accepts only lowercase alphanumeric kebab-case segments.",
        schema: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        example: "web-development"
    },

    CategorySearchParameter: {
        name: "search",
        in: "query",
        required: false,
        description: "Case-insensitive literal substring search on category name. Regex metacharacters are escaped by the service. The value is trimmed and limited to 100 characters; an empty string behaves like no search filter.",
        schema: {
            type: "string",
            maxLength: 100
        },
        example: "web"
    },

    CategoryInactiveParameter: {
        name: "inactive",
        in: "query",
        required: false,
        description: "Requests inclusion of inactive categories. It has an effect only when a valid admin access token is supplied. For anonymous/non-admin callers it is silently ignored. The current Zod preprocessor treats only the exact query string `true` as true; every other supplied value becomes false.",
        schema: {
            type: "boolean",
            default: false
        },
        example: true
    },

    CategoryListSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field used to sort the category list.",
        schema: {
            type: "string",
            enum: ["sortOrder", "createdAt", "updatedAt", "name"],
            default: "sortOrder"
        },
        example: "sortOrder"
    },

    CategoryCoursesSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Course sort key. Backend mapping: price -> finalPrice, students -> studentsCount, rating -> rating.average; createdAt and title map directly.",
        schema: {
            type: "string",
            enum: ["createdAt", "price", "students", "rating", "title"],
            default: "createdAt"
        },
        example: "rating"
    },

    CategoryForceDeleteParameter: {
        name: "force",
        in: "query",
        required: false,
        description: "When the exact query value is `true`, deletion may proceed even if non-deleted courses are assigned to the category; those courses are detached by setting category=null. force does not bypass the child-category restriction. This query is not Zod-validated by the current router; values other than the exact string `true` behave as false.",
        schema: {
            type: "boolean",
            default: false
        },
        example: true
    }
}
