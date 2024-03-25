import BadRequestError from "./bad_request";
import InternalError from "./internal_server";

export const ErrAlreadyExist = "already exist";
export const ErrNotFound = "not found";
export const ErrUnauthorized = "Unauthorized";

export const handleError = (err: Error): BadRequestError | InternalError => {
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