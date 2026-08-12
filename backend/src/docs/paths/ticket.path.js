module.exports = {
    "/tickets/create": {
        post: {
            tags: ["Tickets"],
            operationId: "createTicket",
            summary: "Create a new ticket",
            description:
                "Creates a new support ticket. If assignedToId is provided, the ticket will be assigned to that teacher/admin. Otherwise it will be assigned to admins.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateTicket"
                        }
                    }
                }
            },

            responses: {

                201: {
                    description: "Ticket created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true
                                    },
                                    message: {
                                        type: "string",
                                        example: "ticket created successfully"
                                    },
                                    data: {
                                        $ref: "#/components/schemas/Ticket"
                                    }
                                }
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                409: {
                    $ref: "#/components/responses/AssignedToUser"
                },

                429: {
                    $ref: "#/components/responses/TooManyTickets"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },


    "/tickets/{id}/reply": {

        post: {

            tags: ["Tickets"],
            operationId: "replyToTicket",

            summary: "Reply to a ticket",

            description:
                "Adds a reply to an existing ticket. Ticket owners may continue replying after assignment; their reply reopens a pending conversation. Closed tickets cannot receive replies.",


            security: [
                {
                    bearerAuth: []
                }
            ],


            parameters: [

                {
                    $ref: "#/components/parameters/IdParameter"
                }

            ],


            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {
                            $ref: "#/components/schemas/ReplyMessage"
                        }

                    }

                }

            },


            responses: {


                201: {

                    description: "Reply created successfully",

                    content: {

                        "application/json": {

                            schema: {

                                type: "object",

                                properties: {

                                    success: {
                                        type: "boolean",
                                        example: true
                                    },

                                    message: {
                                        type: "string",
                                        example: "reply created successfully"
                                    },

                                    data: {
                                        $ref: "#/components/schemas/Ticket"
                                    }

                                }

                            }

                        }

                    }

                },


                400: {
                    $ref: "#/components/responses/FailedValidation"
                },


                401: {
                    $ref: "#/components/responses/Unauthorized"
                },


                403: {

                    description:
                        "User is banned, has no access, or ticket is closed",

                    content: {

                        "application/json": {

                            schema: {
                                $ref: "#/components/schemas/Error"
                            }

                        }

                    }

                },


                404: {
                    $ref: "#/components/responses/TicketNotFound"
                },


                500: {
                    $ref: "#/components/responses/InternalServerError"
                }

            }

        }

    },


    "/tickets/{id}/change-status": {


        patch: {


            tags: ["Tickets"],
            operationId: "changeTicketStatus",

            summary: "Change ticket status",

            description:
                "Changes ticket status. Only assigned staff members or admins can change status.",


            security: [
                {
                    bearerAuth: []
                }
            ],


            parameters: [

                {
                    $ref: "#/components/parameters/IdParameter"
                }

            ],


            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {
                            $ref: "#/components/schemas/ChangeTicketStatus"
                        }

                    }

                }

            },


            responses: {


                200: {

                    description:
                        "Ticket status changed successfully",

                    content: {

                        "application/json": {

                            schema: {
                                $ref: "#/components/schemas/Success"
                            }

                        }

                    }

                },


                400: {
                    $ref: "#/components/responses/FailedValidation"
                },


                401: {
                    $ref: "#/components/responses/Unauthorized"
                },


                403: {

                    description:
                        "No permission to change status",

                    content: {

                        "application/json": {

                            schema: {
                                $ref: "#/components/schemas/Error"
                            }

                        }

                    }

                },


                404: {
                    $ref: "#/components/responses/TicketNotFound"
                },


                500: {
                    $ref: "#/components/responses/InternalServerError"
                }

            }

        }

    },



    "/tickets/me": {


        get: {


            tags: ["Tickets"],
            operationId: "getCurrentUserTickets",


            summary: "Get my tickets",


            description:
                "Returns authenticated user's tickets with pagination, filtering and sorting.",


            security: [
                {
                    bearerAuth: []
                }
            ],


            parameters: [

                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/TicketStatusParameter"
                },

                {
                    $ref: "#/components/parameters/TicketSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }

            ],



            responses: {


                200: {

                    description:
                        "Tickets fetched successfully"

                },


                401: {
                    $ref: "#/components/responses/Unauthorized"
                },


                403: {
                    $ref: "#/components/responses/Forbidden"
                },


                500: {
                    $ref: "#/components/responses/InternalServerError"
                }


            }


        }

    },




    "/tickets/admin/get-all": {


        get: {


            tags: [
                "Tickets",
                "Admins"
            ],
            operationId: "getAllTickets",


            summary:
                "Get staff tickets",


            description:
                "Teachers receive assigned tickets. Admins receive admin tickets.",



            security: [
                {
                    bearerAuth: []
                }
            ],



            parameters: [

                {
                    $ref: "#/components/parameters/PageParameter"
                },


                {
                    $ref: "#/components/parameters/LimitParameter"
                },


                {
                    $ref: "#/components/parameters/TicketStatusParameter"
                },


                {
                    $ref: "#/components/parameters/AvailableOnlyParameter"
                },


                {
                    $ref: "#/components/parameters/TicketSortByParameter"
                },


                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }


            ],



            responses: {


                200: {

                    description:
                        "Tickets fetched successfully"

                },


                401: {
                    $ref: "#/components/responses/Unauthorized"
                },


                403: {
                    $ref: "#/components/responses/Forbidden"
                },


                500: {
                    $ref: "#/components/responses/InternalServerError"
                }

            }

        }

    },




    "/tickets/{id}": {


        get: {


            tags: [
                "Tickets"
            ],
            operationId: "getTicketById",


            summary:
                "Get ticket by id",


            description:
                "Returns ticket details with populated user references.",



            security: [

                {
                    bearerAuth: []
                }

            ],



            parameters: [

                {
                    $ref: "#/components/parameters/IdParameter"
                }

            ],



            responses: {


                200: {

                    description:
                        "Ticket fetched successfully",

                    content: {

                        "application/json": {

                            schema: {

                                type: "object",

                                properties: {

                                    success: {
                                        type: "boolean",
                                        example: true
                                    },

                                    message: {
                                        type: "string",
                                        example: "ticket fetched successfully"
                                    },

                                    data: {
                                        $ref:
                                            "#/components/schemas/TicketPopulated"
                                    }

                                }

                            }

                        }

                    }

                },


                400: {
                    $ref: "#/components/responses/InvalidId"
                },


                401: {
                    $ref: "#/components/responses/Unauthorized"
                },


                403: {
                    $ref: "#/components/responses/Forbidden"
                },


                404: {
                    $ref: "#/components/responses/TicketNotFound"
                },


                500: {
                    $ref: "#/components/responses/InternalServerError"
                }


            }


        }

    }

}