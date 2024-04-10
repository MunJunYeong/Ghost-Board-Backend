import * as Redis from "redis"
export * from "redis"

import { logger } from "./logger"

class RedisClient {
    private static instance: Redis.RedisClientType | null = null;

    private constructor() { }

    // 싱글톤 패턴을 사용하여 Redis 클라이언트 인스턴스를 가져옴
    public static getInstance(): Redis.RedisClientType {
        if (!RedisClient.instance) {
            const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
            RedisClient.instance = Redis.createClient({
                password: process.env.REDIS_PASSWORD,
                socket: {
                    host: process.env.REDIS_HOST,
                    port: redisPort
                }
            });

            // Redis 클라이언트 이벤트 핸들링
            RedisClient.instance.on("error", (err: any) => {
                logger.error("Redis Error:", err);
            });
        }
        return RedisClient.instance;
    }
}

// 싱글톤 RedisClient 인스턴스를 생성하고 export
export default RedisClient.getInstance();