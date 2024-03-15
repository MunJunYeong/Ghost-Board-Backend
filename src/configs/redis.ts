import Redis from "ioredis";
export * from "ioredis";

export default class RedisClient {
    private static instance: Redis | null = null;

    private constructor() {}

    static getInstance(): Redis {
        if (!RedisClient.instance) {
            const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
            RedisClient.instance = new Redis({
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: redisPort,
                password: process.env.REDIS_PASSWORD || "redis",
            });
        }
        return RedisClient.instance;
    }
}
