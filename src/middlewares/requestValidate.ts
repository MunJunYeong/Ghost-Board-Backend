import { logger } from "@configs/logger";
import { validationPipe } from "@utils/validation";
import { NextFunction, Request, Response } from "express";

export const validationMiddleware =
    (validationSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
        const result: any = await validationPipe(validationSchema, { ...req.body, ...req.params });
        if (result.errors) {
            logger.error(result);
            return res.status(400).json({
                success: false,
                ...result,
            });
        }

        next();
        return true;
    };
