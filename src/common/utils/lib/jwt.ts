import jwt from "jsonwebtoken";

import { promisify } from "util";
import { logger } from "@configs/logger";
import { DecodedUser } from "@controllers/common.dto";
import RedisClient from "@configs/redis";

export const issueAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        algorithm: "HS256",
        expiresIn: "1h",
    });
};

export const issueRefreshToken = () => {
    return jwt.sign({}, process.env.JWT_SECRET_KEY!, {
        algorithm: "HS256",
        expiresIn: "14d",
    });
};

export const verifyAccessToken = (token: string) => {
    let decoded: DecodedUser;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedUser;
        return {
            valid: true,
            user: decoded,
            error: null,
        };
    } catch (err: any) {
        const data = jwt.decode(token) as DecodedUser;
        return {
            valid: false,
            user: data,
            error: err,
        };
    }
};

export const verifyRefreshToken = async (token: string, userID: string) => {
    // redis 모듈이 프로미스를 지원하지 않기에 직접 promise를 반환해주어야 함.
    const redis = RedisClient.getInstance();
    const getAsync = promisify(redis.get).bind(redis);

    try {
        // userID로 저장된 refresh token 가져오기
        const data = await getAsync(userID);
        if (token === data) {
            jwt.verify(token, process.env.JWT_SECRET_KEY!);
            return true;
        } else {
            logger.error("wrong refresh token");
            return false;
        }
    } catch (err: any) {
        logger.error(`cant verify refresh token - ${err.message}`);
        return false;
    }
};
