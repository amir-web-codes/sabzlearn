const fs = require("fs")
const path = require("path")
const pino = require("pino")

const logDirectory = path.join(__dirname, "..", "logs")
fs.mkdirSync(logDirectory, { recursive: true })

const logFiles = {
    info: path.join(logDirectory, "info.log"),
    warn: path.join(logDirectory, "warn.log"),
    error: path.join(logDirectory, "error.log"),
    fatal: path.join(logDirectory, "fatal.log")
}

Object.values(logFiles).forEach((filePath) => {
    fs.closeSync(fs.openSync(filePath, "a"))
})

function createLevelLogger(level, filePath, bindings = {}) {
    return pino(
        {
            level,
            base: bindings,
            timestamp: pino.stdTimeFunctions.isoTime,
            serializers: {
                err: pino.stdSerializers.err
            }
        },
        pino.destination({ dest: filePath, sync: false })
    )
}

function normalizePayload(payload, message) {
    const baseMessage = typeof payload === "string"
        ? payload
        : message || payload?.message || "log entry"

    const normalized = {
        message: baseMessage,
        context: {}
    }

    if (typeof payload === "string") {
        return normalized
    }

    if (payload && typeof payload === "object") {
        Object.entries(payload).forEach(([key, value]) => {
            if (key === "message") {
                return
            }

            if (key === "err" || key === "error") {
                if (value instanceof Error) {
                    normalized.error = {
                        message: value.message,
                        stack: value.stack
                    }
                } else if (value && typeof value === "object") {
                    normalized.error = {
                        ...(value.message ? { message: value.message } : {}),
                        ...(value.stack ? { stack: value.stack } : {})
                    }
                }

                return
            }

            if (key === "stack") {
                normalized.error = normalized.error || {}
                normalized.error.stack = value
                return
            }

            normalized.context[key] = value
        })
    }

    return normalized
}

function createLogger(options = {}) {
    const level = options.level || process.env.LOG_LEVEL || "info"
    const service = options.serviceName || "sabzlearn"
    const bindings = {
        service,
        ...(options.bindings || {})
    }

    const levelLoggers = {
        info: createLevelLogger(level, logFiles.info, bindings),
        warn: createLevelLogger(level, logFiles.warn, bindings),
        error: createLevelLogger(level, logFiles.error, bindings),
        fatal: createLevelLogger(level, logFiles.fatal, bindings)
    }

    const log = (logLevel, payload, message) => {
        const normalizedPayload = normalizePayload(payload, message)
        levelLoggers[logLevel][logLevel](normalizedPayload)
    }

    return {
        info(payload, message) {
            log("info", payload, message)
        },
        warn(payload, message) {
            log("warn", payload, message)
        },
        error(payload, message) {
            log("error", payload, message)
        },
        fatal(payload, message) {
            log("fatal", payload, message)
        },
        child(bindings = {}) {
            return createLogger({ level, serviceName: service, bindings })
        }
    }
}
const logger = createLogger()

module.exports = logger
module.exports.createLogger = createLogger
