import { NextFunction, Request, Response } from "express";

import { logger } from "@configs/logger";
import BadRequestError from "@errors/bad_request";
import { ValidationError, validationPipe } from "@utils/validation";

export const validationMiddleware =
    (validationSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
        const result: ValidationError[] = await validationPipe(validationSchema, { ...req.body, ...req.params });

        if (result.length > 0) {
            const errProperties: string[] = [];

            logger.error("request middleware errors occured");
            for (const err of result) {
                // thinking : 어떤 이유로 argument가 틀렸는지 log로 다 남길 필요가 있을것인가 ?
                // logger.error(`validation Error: ${err.property} - ${JSON.stringify(err.constraints)}`);

                errProperties.push(err.property);
            }

            const errString = errProperties.join(", ");
            const err = new Error(`invalid argument [ ${errString} ]`);
            throw new BadRequestError({ error: err });
        }

        next();
        return true;
    };
