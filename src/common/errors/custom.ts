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
