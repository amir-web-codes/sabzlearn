module.exports = {
    UserCourseSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort the current user's enrolled courses by",
        schema: { type: "string", enum: ["createdAt"], default: "createdAt" },
        example: "createdAt"
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