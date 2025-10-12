import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();
const redisClient = createClient({
    url: process.env.REDIS_URI
});


redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err: any) => console.error("❌ Redis error", err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
}

export default redisClient;