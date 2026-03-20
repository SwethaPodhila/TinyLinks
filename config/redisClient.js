import { createClient } from "redis";


const client = createClient({
    url: process.env.RedisUrl
});

client.on("error", (err) => console.log("Redis Error:", err));

await client.connect();

console.log("Redis connected ✅");

export default client;