import { logger } from "@configs/logger";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "@errors/custom-error";

export const errorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        const { statusCode, message, stack, logging } = err;
        if (logging) {
            logger.error(
                JSON.stringify(
                    {
                        code: statusCode,
                        message: message,
                        stack: stack,
                    },
                    null,
                    2
                )
            );
        }
        return res.status(statusCode).send({ message: message });
    }

    // Unhandled errors
    logger.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ errors: [{ message: "unhandled error occured" }] });
};
