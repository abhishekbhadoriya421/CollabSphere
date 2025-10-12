import redisClient, { connectRedis } from "@shared/redis-config/redisconfig";
import { stringify } from "querystring";
import { json } from "stream/consumers";

interface CachedUser { // User data format will be cached
    userId: number;
    socketId: string;
    joinedAt: number; // It will be stored as unix time string
    isOnline: boolean;
}

/**
 * Cache User Data Cache Class
 */
export default class UserCacheService {
    private readonly USER_PREFIX = 'user:';
    private readonly CHANNEL_PREFIX = 'channel:';
    private readonly ONLINE_USERS_KEY = 'online_users';
    /**
     * Cache user data when user connection stablished
     */
    constructor() {
        if (!redisClient.isOpen) {
            connectRedis();
        }
    }

    async cacheUser(user_id: number, socket_id: string, joined_at: number): Promise<void> {
        console.log(joined_at + " Joined at")
        const userKey = `${this.USER_PREFIX}${user_id}`;

        const userCache: CachedUser = {
            userId: user_id,
            socketId: socket_id,
            joinedAt: joined_at,
            isOnline: true
        }
        redisClient.setEx(userKey, 24 * 60 * 60, JSON.stringify(userCache));
        redisClient.sAdd(this.ONLINE_USERS_KEY, user_id.toString());

        console.log('User Cache Saved');
    }

    // Get user by ID
    async getUser(userId: number): Promise<CachedUser | null> {
        const userKey = `${this.USER_PREFIX}${userId}`;
        const userData = await redisClient.get(userKey);
        if (!userData) return null;
        return JSON.parse(userData);
    }


    async getOnlineUsers(): Promise<CachedUser[]> {
        const onlineUserIdsRaw = await redisClient.sMembers(this.ONLINE_USERS_KEY) as Array<string> | [];
        const users: CachedUser[] = [];

        for (const userId of onlineUserIdsRaw) {
            const user = await this.getUser(parseInt(userId));
            if (user) {
                users.push(user);
            }
        }
        return users;
    }

    async getUserBySocketId(socketId: string): Promise<CachedUser | null> {
        const onlineUsers = await this.getOnlineUsers();
        return onlineUsers.find(user => user.socketId === socketId) || null;
    }

    async removeUser(user_id: number): Promise<void> {
        const key = `${this.USER_PREFIX}${user_id}`;
        redisClient.del(key);
        redisClient.sRem(this.ONLINE_USERS_KEY, user_id.toString());
    }
}