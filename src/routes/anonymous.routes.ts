import { Request, Response, Router } from "express";

import anonymousController from "@controllers/anonymous/anonymous.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";

class AnonymousRoutes {
    router = Router();
    controller = new anonymousController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/signup", validationMiddleware(dto.SignupReqDTO), this.controller.signup);
        this.router.post("/signup/send-email", validationMiddleware(dto.EmailReqDTO), this.controller.sendEmailForSignup);
        this.router.post("/signup/check-email", validationMiddleware(dto.CheckEmailReqDTO), this.controller.checkEmailForSignup);

        this.router.post("/login", validationMiddleware(dto.LoginReqDTO), this.controller.login);

        this.router.post("/refresh", this.controller.refresh);

        // Email로 회원가입한 정보 찾기 - ID 찾기 용
        this.router.post("/find-id", validationMiddleware(dto.EmailReqDTO), this.controller.findMaskingUser);
        // Email, username으로 회원가입한 정확한 ID 정보를 Email 전송 - ID 찾기 용
        this.router.post("/find-id/send-email", validationMiddleware(dto.SendIDReqDTO), this.controller.sendExactUserID);

        // Change password
        this.router.post("/change-password", validationMiddleware(dto.ChangePasswordReqDTO), this.controller.changePassword);
        this.router.post("/change-password/send-email", validationMiddleware(dto.EmailReqDTO), this.controller.sendEmailForPassword);
        this.router.post("/change-password/check-email", validationMiddleware(dto.CheckEmailReqDTO), this.controller.checkEmailForPassword);
    }
}

export default new AnonymousRoutes().router;
