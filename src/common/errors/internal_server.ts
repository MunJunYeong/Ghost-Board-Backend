import { CustomError } from "./custom-error";

export default class InternalError extends CustomError {
    private static readonly DEFAULT_STATUS_CODE = 500;
    private readonly _code: number;
    private readonly _stack?: string;
    private readonly _logging: boolean;

    constructor(params?: { code?: number; error?: Error; message?: string }) {
        let combinedMsg: string;
        if (params?.message && params?.error) {
            combinedMsg = `${params.message}: ${params.error.message}`;
        } else if (params?.error) {
            combinedMsg = params.error.message;
        } else {
            combinedMsg = params?.message || "Internal server error";
        }

        super(combinedMsg);
        this._code = params?.code || InternalError.DEFAULT_STATUS_CODE;
        this._stack = params?.error?.stack;
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
