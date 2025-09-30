import { connectRedis } from "../config/redisconfig";
export async function setCache(key: string, ttl: number, value: any) {
    try {
        const redis = await connectRedis();
        const stringValue =
            typeof value === "string" ? value : JSON.stringify(value);

        await redis.set(key, stringValue, { EX: ttl });
    } catch (err: unknown) {
        console.error("Error while caching data:", err);
    }
}

export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const redis = await connectRedis();
        const data = await redis.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch {
            return data as unknown as T;
        }
    } catch (err: unknown) {
        console.error("Error while getting cache:", err);
        return null;
    }
}


export async function deleteCache(key: string) {
    try {
        const redis = await connectRedis();
        const result = await redis.del(key);
        console.log(`Deleted ${result} key(s)`);
    } catch (err) {
        console.error("Error deleting cache:", err);
    }
}