module.exports = {
    SortOrderParameter: {
        name: "sortOrder",
        in: "query",
        required: false,
        description: "Sort direction",
        schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
        example: "desc"
    },

    UserCourseSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort the current user's enrolled courses by",
        schema: { type: "string", enum: ["createdAt"], default: "createdAt" },
        example: "createdAt"
    },

    UserCommentSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort the current user's comments by",
        schema: { type: "string", enum: ["createdAt", "rating"], default: "createdAt" },
        example: "createdAt"
    },
    CommentRatingFilterParameter: {
        name: "rating",
        in: "query",
        required: false,
        description: "Filter the current user's comments by rating",
        schema: { type: "string", enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"] },
        example: "Good"
    },
    RequestSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort role-change requests by",
        schema: { type: "string", enum: ["createdAt"], default: "createdAt" },
        example: "createdAt"
    },
    RequestStatusFilterParameter: {
        name: "status",
        in: "query",
        required: false,
        description: "Filter role-change requests by status. Only usable on the get-all endpoint (get-pending is always implicitly status=pending).",
        schema: { type: "string", enum: ["pending", "accepted", "rejected"] },
        example: "pending"
    },
    RequestedRoleFilterParameter: {
        name: "requestedRole",
        in: "query",
        required: false,
        description: "Filter role-change requests by the role being requested",
        schema: { type: "string", enum: ["teacher", "admin"] },
        example: "teacher"
    }
}