import BadRequestError from "./bad_request";
import InternalError from "./internal_server";

export abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly message: string;
    abstract readonly stack?: string;
    abstract readonly logging: boolean;

    constructor(message: string) {
        super(message);

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export const ErrAlreadyExist = "already exist";
export const ErrNotFound = "not found";
export const ErrUnauthorized = "Unauthorized";

export const handleError = (err: Error): CustomError => {
    if (err.message === ErrNotFound) {
        return new BadRequestError({ code: 404, error: err });
    }
    if (err.message === ErrAlreadyExist) {
        return new BadRequestError({ code: 400, error: err });
    }
    if (err.message === ErrUnauthorized) {
        return new BadRequestError({ code: 401, error: err });
    }
    return new InternalError({ error: err });
}