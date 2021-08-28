export const redisOptions = {
    removeOnSuccess: false,
    redis: {
        host: process.env.REDIS_SERVER_HOST,
        port: process.env.REDIS_SERVER_PORT
    }
};
