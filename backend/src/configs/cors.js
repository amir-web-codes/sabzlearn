const cors = require("cors")

const getAllowedOrigins = () => {
    const nodeEnv = process.env.NODE_ENV || "development"

    const developmentOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    const productionOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean)

    return nodeEnv === "development" ? developmentOrigins : productionOrigins
}

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins()

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS policy"))
        }
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRF-Token",
        "Accept",
        "Accept-Language",
        "Content-Language",
        "X-API-Key"
    ],

    exposedHeaders: [
        "Content-Range",
        "X-Content-Range",
        "X-Total-Count",
        "X-Page-Count",
        "X-Current-Page",
        "X-Per-Page",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset"
    ],

    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 200
}

const corsMiddleware = cors(corsOptions)

const corsErrorHandler = (err, req, res, next) => {
    if (err.message === "Not allowed by CORS policy") {
        return res.status(403).json({
            success: false,
            message: "CORS policy: Origin not allowed",
            origin: req.get("origin"),
            requestedURL: req.originalUrl
        })
    }
    next(err)
}

module.exports = {
    corsMiddleware,
    corsErrorHandler,
    corsOptions,
    getAllowedOrigins
}
