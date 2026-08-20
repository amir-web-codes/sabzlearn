module.exports = {
    bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Access token returned by POST /users/auth/signup, POST /users/auth/login, or POST /users/refresh-token. Send it as `Authorization: Bearer <accessToken>`. The token expires after 5 minutes."
    },

    refreshTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "httpOnly refresh-token cookie set by signup/login and rotated by POST /users/refresh-token. Cookie path is `/users/refresh-token`, SameSite is `strict`, Secure is enabled in production, and Max-Age is 15 days when rememberMe=true or 1 day otherwise. Browser clients making cross-origin requests must include credentials."
    },

    deviceIdCookie: {
        type: "apiKey",
        in: "cookie",
        name: "deviceId",
        description: "httpOnly device/session identifier. Signup creates a UUID; login reuses an existing deviceId cookie or creates one if missing. Cookie path is `/users`, SameSite is `lax`, Secure is enabled in production, and Max-Age is 1 year. This path allows the cookie to be sent to `/users/refresh-token` and the other `/users` routes that read it. Logout currently clears only `refreshToken`, so `deviceId` remains until it expires or is explicitly cleared; deleting the current user profile clears both cookies. Browser clients making cross-origin requests must include credentials."
    }
}