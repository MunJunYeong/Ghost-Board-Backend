import jwt from "jsonwebtoken";
import { promisify } from "util";
import redis from "@configs/redis";
import { logger } from "@configs/logger";
import { ErrUnauthorized } from "../errors/custom";

const issueAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        algorithm: "HS256",
        expiresIn: "1h",
    });
};

const issueRefreshToken = () => {
    return jwt.sign({}, process.env.JWT_SECRET_KEY!, {
        algorithm: "HS256",
        expiresIn: "14d",
    });
};

const verifyAccessToken = (token: string) => {
    let decoded: any = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        return decoded;
    } catch (err: any) {
        throw new Error(ErrUnauthorized);
    }
};

const verifyRefreshToken = async (token: string, userID: string) => {
    // redis 모듈이 프로미스를 지원하지 않기에 직접 promise를 반환해주어야 함.
    // TODO:
    // const getAsync = promisify(redis.get).bind(redis);

    try {
        // userID로 저장된 refresh token 가져오기
        // const data = await getAsync(userID);
        const data = null;
        if (token === data) {
            jwt.verify(token, process.env.JWT_SECRET_KEY!);
            return true;
        } else {
            logger.warn("wrong refresh token");
            return false;
        }
    } catch (err: any) {
        logger.error(`cant verify refresh token - ${err.message}`);
        return false;
    }
};

export { issueAccessToken, issueRefreshToken, verifyAccessToken, verifyRefreshToken };
