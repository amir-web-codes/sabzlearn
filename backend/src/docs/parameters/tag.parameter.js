module.exports = {
    TagSlugParameter: {
        name: "slug",
        in: "path",
        required: true,
        description: "Tag slug. The router trims it, requires 2-100 characters, and accepts lowercase alphanumeric kebab-case only.",
        schema: {
            $ref: "#/components/schemas/KebabSlug"
        },
        example: "nodejs"
    },

    TagSearchParameter: {
        name: "search",
        in: "query",
        required: false,
        description: "Case-insensitive literal substring search on tag name. Regex metacharacters are escaped by the service. The value is trimmed and limited to 100 characters; an empty value behaves like no search filter.",
        schema: {
            type: "string",
            maxLength: 100
        },
        example: "node"
    },

    TagListSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field used to sort the tag list.",
        schema: {
            type: "string",
            enum: [
                "name",
                "createdAt"
            ],
            default: "createdAt"
        },
        example: "createdAt"
    },

    TagForceDeleteParameter: {
        name: "force",
        in: "query",
        required: false,
        description: "When the exact query value is `true`, a tag assigned to non-deleted courses may be deleted and the tag id is pulled from course tag arrays. This query is not Zod-validated by the current router; any value other than the exact string `true` behaves as false.",
        schema: {
            type: "boolean",
            default: false
        },
        example: true
    }
}