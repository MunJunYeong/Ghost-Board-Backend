import { CustomError } from "./custom";

export default class BadRequestError extends CustomError {
    private static readonly DEFAULT_STATUS_CODE = 400;
    private readonly _code: number;
    private readonly _stack?: string;
    private readonly _logging: boolean;

    constructor(params?: { code?: number; error: Error }) {
        super(params?.error.message || "Bad request");
        this._code = params?.code || BadRequestError.DEFAULT_STATUS_CODE;
        this._stack = params?.error.stack;
        this._logging = true;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    get statusCode(): number {
        return this._code;
    }

    get message(): string {
        return this._stack || "";
    }

    get stack(): string | undefined {
        return this._stack;
    }

    get logging(): boolean {
        return this._logging;
    }
}
