import Redis from "ioredis";
export * from "ioredis";

export default class RedisClient {
    private static instance: RedisClient;
    private redisInstance: Redis | null;

    private constructor() {
        this.redisInstance = null;
    }

    public initialize(): void {
        if (!this.redisInstance) {
            const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
            this.redisInstance = new Redis({
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: redisPort,
                password: process.env.REDIS_PASSWORD || "redis",
            });
        }
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public getRedisInstance(): Redis {
        if (!this.redisInstance) {
            throw new Error("Redis instance has not been initialized.");
        }
        return this.redisInstance;
    }
}
