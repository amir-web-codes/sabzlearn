module.exports = {
    CategoriesFetchedSuccessfully: {
        description: "Categories fetched successfully. The empty state is an empty data array.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CategoriesListResponse"
                }
            }
        }
    },

    CategoryFetchedSuccessfully: {
        description: "Category fetched successfully with populated parent and createdBy references.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CategoryFetchedResponse"
                }
            }
        }
    },

    CategoryCreatedSuccessfully: {
        description: "Category created successfully. The returned category is the raw created Mongoose document, so parent and createdBy are ObjectId references rather than populated objects.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CategoryCreatedResponse"
                }
            }
        }
    },

    CategoryUpdatedSuccessfully: {
        description: "Category updated successfully. The returned category is the raw saved Mongoose document, so parent and createdBy are ObjectId references rather than populated objects.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CategoryUpdatedResponse"
                }
            }
        }
    },

    CategoryDeletedSuccessfully: {
        description: "Category deleted successfully. The controller does not return the deleted category document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CategoryDeletedResponse"
                },
                example: {
                    success: true,
                    message: "category deleted successfully"
                }
            }
        }
    },

    CategoryCoursesFetchedSuccessfully: {
        description: "Published, non-deleted courses belonging to the selected category or any descendant category were fetched successfully. The empty state is an empty data array. Course references are not populated.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/PublishedCoursesListResponse"
                }
            }
        }
    },

    CategoryNotFound: {
        description: "No category is available for the supplied slug. For GET /categories/{slug}, inactive categories are intentionally hidden from anonymous and non-admin callers and produce this same 404 response.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "category not found"
                }
            }
        }
    },

    ParentCategoryNotFound: {
        description: "The supplied parent ObjectId is syntactically valid but does not identify an existing category.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "parent category not found"
                }
            }
        }
    },

    CategoryOrParentNotFound: {
        description: "Either the category identified by the slug does not exist, or the supplied parent ObjectId does not identify an existing category.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    categoryNotFound: {
                        summary: "Category slug does not exist",
                        value: {
                            success: false,
                            message: "category not found"
                        }
                    },
                    parentNotFound: {
                        summary: "Parent ObjectId does not exist",
                        value: {
                            success: false,
                            message: "parent category not found"
                        }
                    }
                }
            }
        }
    },

    DuplicateSiblingCategory: {
        description: "Another category under the same parent already has the same trimmed name, compared case-insensitively.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "a category with this name already exists under the same parent"
                }
            }
        }
    },

    CategoryUpdateBadRequest: {
        description: "The slug/body failed Zod validation, the body had no text field to update, the category was selected as its own parent, or the requested parent would create a circular hierarchy.",
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { $ref: "#/components/schemas/ValidationError" },
                        { $ref: "#/components/schemas/Error" }
                    ]
                },
                examples: {
                    validationFailed: {
                        summary: "Slug or multipart text fields failed Zod validation",
                        value: {
                            success: false,
                            message: "validation failed",
                            errors: [
                                {
                                    code: "custom",
                                    path: [],
                                    message: "No fields to update"
                                }
                            ]
                        }
                    },
                    selfParent: {
                        summary: "Category selected as its own parent",
                        value: {
                            success: false,
                            message: "a category cannot be its own parent"
                        }
                    },
                    circularHierarchy: {
                        summary: "Parent selection creates a cycle",
                        value: {
                            success: false,
                            message: "this parent selection would create a circular category hierarchy"
                        }
                    }
                }
            }
        }
    },

    CategoryDeleteConflict: {
        description: "Deletion is blocked because the category has child categories, or because non-deleted courses are still assigned and force=true was not supplied.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    hasChildren: {
                        summary: "Category has child categories",
                        value: {
                            success: false,
                            message: "cannot delete a category that has child categories"
                        }
                    },
                    hasCourses: {
                        summary: "Category still has assigned courses",
                        value: {
                            success: false,
                            message: "cannot delete a category that still has courses assigned to it, pass ?force=true to detach them"
                        }
                    }
                }
            }
        }
    }
}