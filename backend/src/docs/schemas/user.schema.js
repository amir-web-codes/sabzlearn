module.exports = {
    UserAvatar: {
        type: "object",
        properties: {
            url: {
                type: "string",
                example: "https://res.cloudinary.com/.../avatars/xyz.jpg"
            },

            publicId: {
                type: "string",
                nullable: true,
                example: "sabzlearn/avatars/xyz"
            }
        },

        required: [
            "url",
            "publicId"
        ]
    },

    User: {
        type: "object",
        description: "User shape returned by userService.findUserById(). Password is never returned. bannedBy is populated with username/email; deletedBy remains an ObjectId.",

        properties: {
            _id: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                readOnly: true,
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            username: {
                type: "string",
                minLength: 3,
                maxLength: 30,
                example: "amir"
            },

            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "amir@gmail.com"
            },

            role: {
                type: "string",
                enum: [
                    "user",
                    "admin",
                    "teacher"
                ],
                example: "user"
            },

            avatar: {
                $ref: "#/components/schemas/UserAvatar"
            },

            isBanned: {
                type: "boolean",
                example: false
            },

            banReason: {
                type: "string",
                nullable: true,
                maxLength: 200,
                example: "Spam"
            },

            bannedBy: {
                allOf: [
                    {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    }
                ],
                nullable: true,
                description: "Admin who banned this user, populated with _id/username/email; null when not set."
            },

            banExpiresAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                description: "null means either the user is not banned or the ban is permanent.",
                example: "2026-08-25T12:00:00.000Z"
            },

            isDeleted: {
                type: "boolean",
                example: false
            },

            deletedBy: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                nullable: true,
                description: "ObjectId of the user/admin who soft-deleted the account. This field is not populated by findUserById().",
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            deletedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: "2026-07-09T12:00:00.000Z"
            },

            lastLogin: {
                type: "string",
                format: "date-time",
                example: "2026-07-09T18:30:00.000Z"
            },

            createdAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-06-01T10:15:30.000Z"
            },

            updatedAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-07-09T18:30:00.000Z"
            },

            __v: {
                type: "integer",
                minimum: 0,
                readOnly: true,
                example: 0
            }
        },

        required: [
            "_id",
            "username",
            "email",
            "role",
            "avatar",
            "isBanned",
            "banReason",
            "bannedBy",
            "banExpiresAt",
            "isDeleted",
            "deletedBy",
            "deletedAt",
            "lastLogin",
            "createdAt",
            "updatedAt",
            "__v"
        ]
    },

    GetUserProfile: {
        type: "object",
        description: "Response for GET /users/me.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "user fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/User"
            },

            meta: {
                type: "object",

                properties: {
                    signUpDate: {
                        type: "string",
                        format: "date-time",
                        example: "2026-06-01T10:15:30.000Z"
                    },

                    lastLogin: {
                        type: "string",
                        format: "date-time",
                        example: "2026-07-09T18:30:00.000Z"
                    }
                },

                required: [
                    "signUpDate",
                    "lastLogin"
                ]
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    GetUserById: {
        type: "object",
        description: "Response for GET /users/admin/{id}.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "user fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/User"
            }
        },

        required: [
            "success",
            "message",
            "data"
        ]
    },

    AuthSuccess: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "login successful"
            },

            accessToken: {
                type: "string",
                description: "JWT access token. Expires 5 minutes after it is issued.",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        },

        required: [
            "success",
            "message",
            "accessToken"
        ]
    },

    UserSignUpJson: {
        type: "object",
        description: "JSON signup body. Use this form when no avatar is uploaded. rememberMe works normally here because it is received as a JSON boolean.",

        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 30,
                example: "amir"
            },

            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "amir@gmail.com"
            },

            password: {
                type: "string",
                minLength: 5,
                maxLength: 70,
                example: "StrongPassword123"
            },

            rememberMe: {
                type: "boolean",
                default: false,
                example: false
            }
        },

        required: [
            "username",
            "email",
            "password"
        ]
    },

    UserSignUpMultipart: {
        type: "object",
        description: "multipart/form-data signup body. The file field name must be exactly `avatar`. Under the current backend implementation, do not send rememberMe in multipart form-data: Multer supplies text fields as strings while the Zod schema requires a boolean. Omit it (defaults to false), or use application/json when rememberMe is needed.",

        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 30,
                example: "amir"
            },

            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "amir@gmail.com"
            },

            password: {
                type: "string",
                minLength: 5,
                maxLength: 70,
                example: "StrongPassword123"
            },

            avatar: {
                type: "string",
                format: "binary",
                description: "Optional image. Allowed MIME types: image/jpeg, image/png, image/webp. Maximum size: 2 MB. Multer-level file rejection currently becomes a generic 500 response; Cloudinary/upload processing failures after user creation are logged and signup continues with the default avatar."
            }
        },

        required: [
            "username",
            "email",
            "password"
        ]
    },

    UserLogin: {
        type: "object",

        properties: {
            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "amir@gmail.com"
            },

            password: {
                type: "string",
                minLength: 5,
                maxLength: 70,
                example: "StrongPassword123"
            },

            rememberMe: {
                type: "boolean",
                default: false,
                example: false
            }
        },

        required: [
            "email",
            "password"
        ]
    },

    UpdateUserJson: {
        type: "object",
        description: "JSON profile update body. username and email are both optional; an empty object is accepted and results in no data change.",

        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 30,
                example: "amir_new"
            },

            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "new-amir@gmail.com"
            }
        }
    },

    UpdateUserMultipart: {
        type: "object",
        description: "multipart/form-data profile update body. All fields are optional. The avatar field name must be exactly `newAvatar`.",

        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 30,
                example: "amir_new"
            },

            email: {
                type: "string",
                format: "email",
                minLength: 5,
                maxLength: 50,
                example: "new-amir@gmail.com"
            },

            newAvatar: {
                type: "string",
                format: "binary",
                description: "Optional replacement avatar. Allowed MIME types: image/jpeg, image/png, image/webp. Maximum size: 2 MB. On successful replacement, the previous stored avatar is deleted."
            }
        }
    },

    ChangePassword: {
        type: "object",

        properties: {
            password: {
                type: "string",
                minLength: 5,
                maxLength: 70,
                example: "NewStrongPassword123"
            }
        },

        required: [
            "password"
        ]
    },

    UserRoleChangeBody: {
        type: "object",
        description: "Request body used when requesting or directly changing a user role.",

        properties: {
            newRole: {
                type: "string",
                enum: [
                    "user",
                    "teacher",
                    "admin"
                ],
                example: "teacher"
            }
        },

        required: [
            "newRole"
        ]
    },

    BanUser: {
        type: "object",
        description: "The object itself must be sent, but both fields are optional. `{}` means a permanent ban with a null reason.",

        properties: {
            banDays: {
                type: "number",
                minimum: 0,
                default: 0,
                description: "0 or omitted means a permanent ban.",
                example: 7
            },

            banReason: {
                type: "string",
                maxLength: 200,
                description: "Optional. If omitted, the backend default becomes null. Explicit JSON null is not accepted by the current Zod schema.",
                example: "Spam"
            }
        }
    },

    RefreshTokenBody: {
        type: "object",
        description: "Send at least an empty JSON object. rememberMe defaults to false when omitted.",

        properties: {
            rememberMe: {
                type: "boolean",
                default: false,
                example: false
            }
        }
    },

    RoleChangeRequestBase: {
        type: "object",

        properties: {
            _id: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                example: "6857e4d1e5d82d0d1f5d8c40"
            },

            processedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: null
            },

            requestedRole: {
                type: "string",
                enum: [
                    "user",
                    "teacher",
                    "admin"
                ],
                example: "teacher"
            },

            currentRole: {
                type: "string",
                enum: [
                    "user",
                    "teacher",
                    "admin"
                ],
                example: "user"
            },

            status: {
                type: "string",
                enum: [
                    "pending",
                    "accepted",
                    "rejected"
                ],
                example: "pending"
            },

            createdAt: {
                type: "string",
                format: "date-time"
            },

            updatedAt: {
                type: "string",
                format: "date-time"
            },

            __v: {
                type: "integer",
                minimum: 0,
                readOnly: true,
                example: 0
            }
        },

        required: [
            "_id",
            "processedAt",
            "requestedRole",
            "currentRole",
            "status",
            "createdAt",
            "updatedAt",
            "__v"
        ]
    },

    RoleChangeRequest: {
        allOf: [
            {
                $ref: "#/components/schemas/RoleChangeRequestBase"
            },

            {
                type: "object",
                description: "Role-change request as returned by the list endpoints (user references are raw ObjectIds).",

                properties: {
                    userId: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        example: "6857e4d1e5d82d0d1f5d8c32"
                    },

                    processedBy: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        nullable: true,
                        example: null
                    }
                },

                required: [
                    "userId",
                    "processedBy"
                ]
            }
        ]
    },

    RoleChangeRequestPopulated: {
        allOf: [
            {
                $ref: "#/components/schemas/RoleChangeRequestBase"
            },

            {
                type: "object",
                description: "Role-change request returned by GET /users/admin/requests/{id}; userId and processedBy are populated with _id/username/email.",

                properties: {
                    userId: {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    },

                    processedBy: {
                        allOf: [
                            {
                                $ref: "#/components/schemas/PopulatedUserReference"
                            }
                        ],
                        nullable: true
                    }
                },

                required: [
                    "userId",
                    "processedBy"
                ]
            }
        ]
    },

    UserDashboard: {
        type: "object",

        properties: {
            user: {
                type: "object",

                properties: {
                    id: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        example: "6857e4d1e5d82d0d1f5d8c32"
                    },

                    username: {
                        type: "string",
                        example: "amir"
                    },

                    email: {
                        type: "string",
                        format: "email",
                        example: "amir@gmail.com"
                    },

                    role: {
                        type: "string",
                        enum: [
                            "user",
                            "admin",
                            "teacher"
                        ],
                        example: "user"
                    },

                    isBanned: {
                        type: "boolean",
                        example: false
                    },

                    lastLogin: {
                        type: "string",
                        format: "date-time"
                    },

                    memberSince: {
                        type: "string",
                        format: "date-time"
                    }
                },

                required: [
                    "id",
                    "username",
                    "email",
                    "role",
                    "isBanned",
                    "lastLogin",
                    "memberSince"
                ]
            },

            stats: {
                type: "object",

                properties: {
                    enrolledCourses: {
                        type: "integer",
                        minimum: 0,
                        description: "Count of active Enrollment documents for the user (`status=active`); cancelled enrollments are excluded.",
                        example: 4
                    },

                    commentsCount: {
                        type: "integer",
                        minimum: 0,
                        example: 12
                    },

                    pendingRequests: {
                        type: "integer",
                        minimum: 0,
                        example: 0
                    }
                },

                required: [
                    "enrolledCourses",
                    "commentsCount",
                    "pendingRequests"
                ]
            },

            overview: {
                type: "object",

                properties: {
                    accountStatus: {
                        type: "string",
                        enum: [
                            "active",
                            "banned"
                        ],
                        example: "active"
                    },

                    hasPendingRoleRequest: {
                        type: "boolean",
                        example: false
                    }
                },

                required: [
                    "accountStatus",
                    "hasPendingRoleRequest"
                ]
            }
        },

        required: [
            "user",
            "stats",
            "overview"
        ]
    },

    UserCourse: {
        type: "object",
        description: "Course fields selected by findUserCourses() through Enrollment.courseId population.",

        properties: {
            _id: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                example: "6857e4d1e5d82d0d1f5d8c10"
            },

            title: {
                type: "string",
                example: "React from zero to hero"
            },

            slug: {
                type: "string",
                example: "react-from-zero-to-hero"
            },

            price: {
                type: "number",
                minimum: 0,
                example: 250000
            },

            discountPrecentage: {
                type: "number",
                minimum: 0,
                maximum: 100,
                example: 20
            }
        },

        required: [
            "_id",
            "title",
            "slug",
            "price",
            "discountPrecentage"
        ]
    },

    UserCoursesListResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "courses fetched successfully"
            },

            data: {
                oneOf: [
                    {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/UserCourse"
                        }
                    },

                    {
                        type: "string",
                        enum: [
                            "no course found"
                        ],
                        example: "no course found"
                    }
                ]
            },

            meta: {
                $ref: "#/components/schemas/PaginationMeta"
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    UserCommentsListResponse: {
        type: "object",
        description: "Response for GET /users/me/get-comments. This endpoint uses a different empty-state string from the admin user-comments endpoint.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "comments fetched successfully"
            },

            data: {
                oneOf: [
                    {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Comment"
                        }
                    },

                    {
                        type: "string",
                        enum: [
                            "you don't have any comment"
                        ],
                        example: "you don't have any comment"
                    }
                ]
            },

            meta: {
                $ref: "#/components/schemas/PaginationMeta"
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    RequestsListResponse: {
        type: "object",
        description: "Shared response shape for GET /users/admin/requests/get-pending and GET /users/admin/requests/get-all.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "requests fetched successfully"
            },

            data: {
                oneOf: [
                    {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/RoleChangeRequest"
                        }
                    },

                    {
                        type: "string",
                        enum: [
                            "no request found"
                        ],
                        example: "no request found"
                    }
                ]
            },

            meta: {
                $ref: "#/components/schemas/PaginationMeta"
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    RequestByIdResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "request fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/RoleChangeRequestPopulated"
            }
        },

        required: [
            "success",
            "message",
            "data"
        ]
    },

    UserDashboardResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "dashboard fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/UserDashboard"
            }
        },

        required: [
            "success",
            "message",
            "data"
        ]
    },

    UserDeletedError: {
        type: "object",
        description: "Returned by POST /users/auth/login when credentials are correct but the account has been soft-deleted.",

        properties: {
            success: {
                type: "boolean",
                enum: [false],
                example: false
            },

            message: {
                type: "string",
                enum: [
                    "user deleted"
                ],
                example: "user deleted"
            },

            details: {
                type: "object",

                properties: {
                    deletedBy: {
                        allOf: [
                            {
                                $ref: "#/components/schemas/PopulatedUserReference"
                            }
                        ],
                        nullable: true
                    },

                    deletedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-07-01T10:00:00.000Z"
                    }
                },

                required: [
                    "deletedBy",
                    "deletedAt"
                ]
            }
        },

        required: [
            "success",
            "message",
            "details"
        ]
    }
}