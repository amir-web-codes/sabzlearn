const crypto = require("crypto")

const UNBOUNDED_PARAMS = ["minPrice", "maxPrice"]

function hasUnboundedParams(filters = {}) {
    return UNBOUNDED_PARAMS.some(
        key => filters[key] !== undefined && filters[key] !== null && filters[key] !== ""
    )
}

function buildCacheKey(prefix, params) {
    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .sort(([a], [b]) => a.localeCompare(b))

    if (!entries.length) return prefix

    const normalized = entries.map(([key, value]) => `${key}=${value}`).join("&")
    const hash = crypto.createHash("sha1").update(normalized).digest("hex").slice(0, 16)

    return `${prefix}:${hash}`
}

function resolveTTL(hasNonDefaultFilters) {
    return hasNonDefaultFilters ? 180 : 600
}

module.exports = { hasUnboundedParams, buildCacheKey, resolveTTL }