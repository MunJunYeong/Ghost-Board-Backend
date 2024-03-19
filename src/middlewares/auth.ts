import BadRequestError from "@src/common/errors/bad_request";
import { ErrUnauthorized } from "@src/common/errors/custom";
import { verifyAccessToken } from "@src/common/utils/jwt";
import { Request, Response, NextFunction } from "express";

// JWT 검증을 위한 미들웨어 함수
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // check token empty
    if (!token) {
        throw new BadRequestError({
            error: new Error("empty token"),
            code: 401,
        });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded.valid) {
        throw new BadRequestError({
            error: decoded.error,
            code: 401,
        });
    }
    req.user = decoded.user

    if (req.user!.id !== Number(req.params.id)) {
        throw new BadRequestError({
            error: new Error("invalid token"),
            code: 401,
        });
    }
    next();
};
