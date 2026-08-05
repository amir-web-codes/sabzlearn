module.exports = {

    TicketNotFound: {
        description: "Ticket not found",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "ticket not found"
                }
            }
        }
    },


    TicketClosed: {
        description: "Ticket is closed and cannot receive new replies",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "this ticket is closed"
                }
            }
        }
    },


    NoAccessToTicket: {
        description: "Authenticated user does not have access to this ticket",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "you don't have access to this ticket"
                }
            }
        }
    },


    MaximumTicketsReached: {
        description: "User reached maximum allowed tickets",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "maximum 3 tickets"
                }
            }
        }
    },


    AssignedUserNotFound: {
        description: "Assigned user does not exist",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "user not found"
                }
            }
        }
    },


    CannotAssignTicketToNormalUser: {
        description: "Ticket cannot be assigned to a normal user",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "you can't assign a ticket to a regular user"
                }
            }
        }
    },


    TicketStatusAlreadySet: {
        description: "Ticket already has requested status",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "ticket already has this status"
                }
            }
        }
    },


    CannotChangeTicketStatus: {
        description: "User does not have permission to change ticket status",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "you don't have permission to change this ticket"
                }
            }
        }
    },


    CannotReopenTicket: {
        description: "Only admins can reopen closed tickets",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "you can't reopen ticket"
                }
            }
        }
    },


    TicketCreatedSuccessfully: {
        description: "Ticket created successfully",

        content: {
            "application/json": {

                schema: {
                    $ref: "#/components/schemas/TicketResponse"
                },

                example: {
                    success: true,
                    message: "ticket created successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c40",
                        title: "Cannot access my course",
                        message: "I purchased a course but cannot access it.",
                        status: "open",
                        for: "admin"
                    }
                }
            }
        }
    },


    ReplyCreatedSuccessfully: {
        description: "Reply created successfully",

        content: {
            "application/json": {

                schema: {
                    $ref: "#/components/schemas/TicketResponse"
                },

                example: {
                    success: true,
                    message: "reply created successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c40",
                        status: "pending",
                        replies: [
                            {
                                message: "We are checking your issue.",
                                senderId: "6857e4d1e5d82d0d1f5d8c32",
                                createdAt: "2026-07-26T12:30:00.000Z"
                            }
                        ]
                    }
                }
            }
        }
    },


    TicketStatusChangedSuccessfully: {
        description: "Ticket status changed successfully",

        content: {
            "application/json": {

                schema: {
                    $ref: "#/components/schemas/Success"
                },

                example: {
                    success: true,
                    message: "ticket status changed successfully"
                }
            }
        }
    },


    TicketsFetchedSuccessfully: {
        description: "Tickets fetched successfully",

        content: {
            "application/json": {

                schema: {
                    $ref: "#/components/schemas/TicketListResponse"
                },

                example: {
                    success: true,
                    message: "tickets fetched successfully",
                    data: [],
                    meta: {
                        totalNumber: 0,
                        totalPages: 0,
                        page: 1,
                        limit: 20
                    }
                }
            }
        }
    },


    TicketFetchedSuccessfully: {
        description: "Single ticket fetched successfully",

        content: {
            "application/json": {

                schema: {
                    $ref: "#/components/schemas/SingleTicketResponse"
                },

                example: {
                    success: true,
                    message: "ticket fetched successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c40",
                        title: "Cannot access my course",
                        status: "open"
                    }
                }
            }
        }
    }

}