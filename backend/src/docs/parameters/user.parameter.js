module.exports = {
    UserCourseSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Sort enrolled-course results by Enrollment.createdAt.",
        schema: {
            type: "string",
            enum: ["createdAt"],
            default: "createdAt"
        },
        example: "createdAt"
    },

    RequestSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Sort role-change requests by Request.createdAt.",
        schema: {
            type: "string",
            enum: ["createdAt"],
            default: "createdAt"
        },
        example: "createdAt"
    },

    RequestStatusFilterParameter: {
        name: "status",
        in: "query",
        required: false,
        description: "Filter role-change requests by status. Only available on /users/admin/requests/get-all; the pending endpoint always queries status=pending internally.",
        schema: {
            type: "string",
            enum: ["pending", "accepted", "rejected"]
        },
        example: "pending"
    },

    RequestedRoleFilterParameter: {
        name: "requestedRole",
        in: "query",
        required: false,
        description: "Filter role-change requests by requested role.",

        schema: {
            type: "string",
            enum: ["user", "teacher", "admin"]
        },

        example: "teacher"
    }
}