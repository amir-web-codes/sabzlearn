module.exports = {
    TagsFetchedSuccessfully: {
        description: "Tags fetched successfully. The empty state is an empty data array.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TagsListResponse"
                }
            }
        }
    },

    TagFetchedSuccessfully: {
        description: "Tag fetched successfully. createdBy remains a raw ObjectId reference.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TagFetchedResponse"
                }
            }
        }
    },

    TagCreatedSuccessfully: {
        description: "Tag created successfully. The backend generates slug; the client supplies only name.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TagCreatedResponse"
                }
            }
        }
    },

    TagUpdatedSuccessfully: {
        description: "Tag updated successfully. When name changes, the backend regenerates a unique slug.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TagUpdatedResponse"
                }
            }
        }
    },

    TagDeletedSuccessfully: {
        description: "Tag deleted successfully. The controller does not return the deleted tag document.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TagDeletedResponse"
                },

                example: {
                    success: true,
                    message: "tag deleted successfully"
                }
            }
        }
    },

    TagCoursesFetchedSuccessfully: {
        description: "Published, non-deleted courses directly assigned the selected tag were fetched successfully. The empty state is an empty data array. Course references are returned as raw ObjectIds because this service uses lean() without populate/projection.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/PublishedCoursesListResponse"
                }
            }
        }
    },

    TagNotFound: {
        description: "No tag exists with the supplied slug.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "tag not found"
                }
            }
        }
    },

    DuplicateTag: {
        description: "Another tag already has the same trimmed name case-insensitively, or already owns the slug generated from the submitted name.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "a tag with this name already exists"
                }
            }
        }
    },

    TagDeleteConflict: {
        description: "At least one non-deleted course is assigned this tag and force=true was not supplied.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "cannot delete a tag that still has courses assigned to it, pass ?force=true to detach them"
                }
            }
        }
    }
}