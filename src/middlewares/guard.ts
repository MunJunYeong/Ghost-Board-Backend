import BadRequestError from "@errors/bad_request";
import { ErrForbidden } from "@errors/error-handler";
import { Permission } from "@utils/enums";
import { verifyAccessToken } from "@utils/lib/jwt";
import { Request, Response, NextFunction } from "express";

export const guardMiddleware = (requiredPermission: Permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req.user 값이 없을 경우
        if (!req.user) {
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
            req.user = decoded.user;
        }

        const userPermission = req.user.role;

        if (!userPermission || !isPermissionGranted(userPermission as Permission, requiredPermission)) {
            throw new BadRequestError({
                error: ErrForbidden,
                code: 403,
            });
        }

        next();
    };
};

const isPermissionGranted = (userPermission: Permission, requiredPermission: Permission): boolean => {
    const permissionHierarchy = {
        [Permission.USER]: 0,
        [Permission.ADMIN]: 1,
        // [Permission.SUPER_ADMIN]: 2,
    };

    const userLevel = permissionHierarchy[userPermission];
    const requiredLevel = permissionHierarchy[requiredPermission];

    return userLevel >= requiredLevel;
};
