module.exports = {
    SlugParameter: {
        name: "slug",
        in: "path",
        required: true,
        description: "Resource slug supplied as a path segment. Normalization is endpoint-specific; this shared parameter does not claim that the backend lowercases or trims it.",
        schema: {
            type: "string",
            minLength: 1
        },
        example: "react-from-zero-to-hero"
    }
}