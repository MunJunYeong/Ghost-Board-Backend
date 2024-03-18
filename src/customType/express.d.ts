import User from "@models/user";

// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
