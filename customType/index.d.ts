import { DecodedUser } from "@controllers/common.dto";

// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare module "express" {
    interface Request {
        user?: DecodedUser; // 또는 다른 사용자 정의 유저 타입
    }
}
