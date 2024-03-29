import BadRequestError from "./bad_request";
import InternalError from "./internal_server";

export const ErrAlreadyExist = new Error("already exist");
export const ErrNotFound = new Error("not found");
export const ErrUnauthorized = new Error("Unauthorized");

export const isEqualNotFound = (err: any) => {
    if (err.message === ErrNotFound) {
        return true
    }
    return false;
}

export const handleError = (err: Error): BadRequestError | InternalError => {
    if (err.message === ErrNotFound.message) {
        return new BadRequestError({ code: 404, error: err });
    }
    if (err.message === ErrAlreadyExist.message) {
        return new BadRequestError({ code: 400, error: err });
    }
    if (err.message === ErrUnauthorized.message) {
        return new BadRequestError({ code: 401, error: err });
    }
    // const로 정의된 error가 많아질 수록 추가되어야 함.
    return new InternalError({ error: err });
}