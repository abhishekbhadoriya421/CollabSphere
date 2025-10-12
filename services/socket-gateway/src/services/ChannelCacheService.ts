import UserCacheService from "./UserCacheService";
interface CachedChannel {
    channelId: number;
    channelName: string | '';
    channelType: string | '';
    userId: number;
    scoketId: string;
}
class ChannelCacheService extends UserCacheService {
    private readonly CHANNEL_PREFIX = 'channel:';
    private readonly USER_CHANNEL_KEY = 'channel_user:';
    constructor() {
        super();
    }

    async cacheChannel(channel_details: CachedChannel): Promise<void> {
        const cacheData: CachedChannel = {
            userId: channel_details.userId,
            scoketId: channel_details.scoketId,
            channelId: channel_details.channelId,
            channelName: channel_details.channelName,
            channelType: channel_details.channelType
        }
        const userKey = `${this.CHANNEL_PREFIX}${channel_details.channelId}`;
        await this.redisClientObject.setEx(userKey, 25 * 60 * 60, JSON.stringify(cacheData));
        await this.redisClientObject.sAdd(`${this.USER_CHANNEL_KEY}${channel_details.channelId}`, channel_details.userId.toString());
        console.log('Channel Data Saved ' + channel_details.channelId);
    }
}

export default new ChannelCacheService()