import Redis from "ioredis";

const getRedisPort = () => {
    const redisPortStr = process.env.REDIS_PORT;
    const redisPort = redisPortStr ? parseInt(redisPortStr, 10) : 6379;
    return redisPort;
};

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: getRedisPort(),
    password: process.env.REDIS_PASSWORD || "redis",
});

export default redis;
