import { CustomError } from "./custom";

export default class InternalError extends CustomError {
    private static readonly DEFAULT_STATUS_CODE = 500;
    private readonly _code: number;
    private readonly _stack?: string;
    private readonly _logging: boolean;

    constructor(params?: { code?: number; error: Error }) {
        super(params?.error.message || "Internal server");
        this._code = params?.code || InternalError.DEFAULT_STATUS_CODE;
        this._stack = params?.error.stack;
        this._logging = true;

        Object.setPrototypeOf(this, InternalError.prototype);
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
