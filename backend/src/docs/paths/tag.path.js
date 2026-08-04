const {
    schemaRef,
    responseRef,
    parameterRef,
    jsonResponse,
    bearerSecurity
} = require("./helpers")

const slug = parameterRef("SlugParameter")
const pagination = [parameterRef("PageParameter"), parameterRef("LimitParameter")]
const securedErrors = {
    400: responseRef("FailedValidation"),
    401: responseRef("Unauthorized"),
    403: responseRef("Forbidden"),
    429: responseRef("TooManyRequestsGlobal"),
    500: responseRef("InternalServerError")
}

module.exports = {
    "/tags/get-all": {
        get: {
            tags: ["Tags"],
            operationId: "getAllTags",
            summary: "List tags",
            description: "Admin or teacher only.",
            security: bearerSecurity,
            parameters: [
                ...pagination,
                parameterRef("SearchParameter"),
                parameterRef("TagSortByParameter"),
                parameterRef("SortOrderParameter")
            ],
            responses: { 200: jsonResponse("Tags fetched successfully", "TagListResponse"), ...securedErrors }
        }
    },

    "/tags/create": {
        post: {
            tags: ["Tags", "Admins"],
            operationId: "createTag",
            summary: "Create a tag",
            security: bearerSecurity,
            requestBody: { required: true, content: { "application/json": { schema: schemaRef("TagWrite") } } },
            responses: { 201: jsonResponse("Tag created successfully", "ResourceResponse"), ...securedErrors }
        }
    },

    "/tags/{slug}/courses": {
        get: {
            tags: ["Tags", "Courses"],
            operationId: "getTagCourses",
            summary: "List published courses with a tag",
            security: [],
            parameters: [
                slug,
                ...pagination,
                parameterRef("CourseSortByParameter"),
                parameterRef("SortOrderParameter")
            ],
            responses: {
                200: jsonResponse("Courses fetched successfully", "CourseListResponse"),
                400: responseRef("FailedValidation"),
                404: jsonResponse("Tag not found", "Error"),
                429: responseRef("TooManyRequestsGlobal"),
                500: responseRef("InternalServerError")
            }
        }
    },

    "/tags/{slug}": {
        get: {
            tags: ["Tags"],
            operationId: "getTagBySlug",
            summary: "Get a tag",
            security: [],
            parameters: [slug],
            responses: {
                200: jsonResponse("Tag fetched successfully", "ResourceResponse"),
                400: responseRef("FailedValidation"),
                404: jsonResponse("Tag not found", "Error"),
                429: responseRef("TooManyRequestsGlobal"),
                500: responseRef("InternalServerError")
            }
        },
        patch: {
            tags: ["Tags", "Admins"],
            operationId: "updateTag",
            summary: "Update a tag",
            security: bearerSecurity,
            parameters: [slug],
            requestBody: { required: true, content: { "application/json": { schema: schemaRef("TagWrite") } } },
            responses: { 200: jsonResponse("Tag updated successfully", "ResourceResponse"), ...securedErrors }
        },
        delete: {
            tags: ["Tags", "Admins"],
            operationId: "deleteTag",
            summary: "Delete a tag",
            description: "Use force=true to detach the tag from assigned courses.",
            security: bearerSecurity,
            parameters: [slug, parameterRef("ForceParameter")],
            responses: {
                200: jsonResponse("Tag deleted successfully", "Success"),
                ...securedErrors,
                404: jsonResponse("Tag not found", "Error"),
                409: jsonResponse("Tag still has assigned courses", "Error")
            }
        }
    }
}
