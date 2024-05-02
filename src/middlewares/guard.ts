import BadRequestError from "@errors/bad_request";
import { ErrForbidden } from "@errors/error-handler";
import { Request, Response, NextFunction } from "express";

export enum Permission {
    USER = "USER",
    ADMIN = "ADMIN",
    // SUPER_ADMIN = "SUPER_ADMIN",
}

export const guardMiddleware = (requiredPermission: Permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermission = req.user?.role;

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
