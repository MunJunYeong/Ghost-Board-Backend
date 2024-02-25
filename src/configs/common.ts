export const GetEnvPath = (): string => {
    let envPath;
    switch (process.env.NODE_ENV?.trim()) {
        case "test":
            envPath = ".env.test";
            break;
        case "production":
            envPath = ".env.production";
            break;
        default: // development
            envPath = ".env.development";
    }
    return envPath;
};
