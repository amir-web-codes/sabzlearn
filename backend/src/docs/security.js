module.exports = {
    bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Access token returned by /auth/signup, /auth/login, or /refresh-token. Sent as `Authorization: Bearer <accessToken>`. Expires after 5 minutes."
    },
    refreshTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "httpOnly cookie set by /auth/signup, /auth/login and /refresh-token. Scoped to path /users/refresh-token. Required by /refresh-token."
    },
    deviceIdCookie: {
        type: "apiKey",
        in: "cookie",
        name: "deviceId",
        description: "httpOnly cookie set by /auth/signup and /auth/login, valid for 1 year. Identifies the device/session and is required by /auth/logout and /refresh-token."
    }
}