const { client } = require("../configs/redis")

async function invalidateKeys(key) {
    let cursor = "0"

    do {
        const result = await client.scan(cursor, {
            MATCH: key,
            COUNT: 100
        })

        cursor = result.cursor

        if (result.keys.length > 0) {
            await client.del(result.keys)
        }

    } while (cursor !== "0")
}

module.exports = invalidateKeys