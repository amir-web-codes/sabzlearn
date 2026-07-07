const { createClient } = require('redis');

const client = createClient({
    url: process.env.redis_URL
})

client.on('error', (err) => console.log('Redis Client Error', err));
client.on(`ready`, () => console.log(`Redis Client Connected`));

async function connectRedis() {
    try {
        await client.connect();
    } catch (err) {
        console.log(`redis connection error: ${err}`)
        process.exit(1)
    }
}

module.exports = { client, connectRedis };