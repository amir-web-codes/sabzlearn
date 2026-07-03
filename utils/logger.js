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

function writeToFile(level, payload, message) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        ...payload,
        ...(message ? { message } : {})
    }

    fs.appendFileSync(logFiles[level], `${JSON.stringify(entry)}\n`, "utf8")
}

function createLogger(options = {}) {
    const level = options.level || process.env.LOG_LEVEL || "info"
    const service = options.serviceName || "sabzlearn"

    const prettyStream = pino.transport({
        target: "pino-pretty",
        options: {
            colorize: !process.env.NO_COLOR,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
        }
    })

    const baseLogger = pino(
        {
            level,
            base: { service },
            timestamp: pino.stdTimeFunctions.isoTime,
            serializers: {
                err: pino.stdSerializers.err
            }
        },
        prettyStream
    )

    const normalizePayload = (payload, message) => {
        if (typeof payload === "string") {
            return { message: payload, ...(message ? { details: message } : {}) }
        }

        if (payload && typeof payload === "object") {
            return message ? { ...payload, message } : payload
        }

        return { message: String(payload || "") }
    }

    const log = (logLevel, payload, message) => {
        const normalizedPayload = normalizePayload(payload, message)
        baseLogger[logLevel](normalizedPayload)
        writeToFile(logLevel, normalizedPayload, undefined)
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
        child(bindings) {
            return createLogger({ level, serviceName: service, bindings })
        }
    }
}

const logger = createLogger()

module.exports = logger
module.exports.createLogger = createLogger
