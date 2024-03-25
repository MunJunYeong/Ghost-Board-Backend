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

