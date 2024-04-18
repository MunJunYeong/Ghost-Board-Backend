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
        // 회원가입 API
        this.router.post("/signup", validationMiddleware(dto.SignupReqDTO), this.controller.signup);
        this.router.post("/signup/send-email", validationMiddleware(dto.EmailReqDTO), this.controller.sendEmailForSignup);
        this.router.post("/signup/check-email", validationMiddleware(dto.CheckEmailReqDTO), this.controller.checkEmailForSignup);
        this.router.post("/signup/check-username", validationMiddleware(dto.CheckUsernameReqDTO), this.controller.checkUsername);

        // 로그인  API
        this.router.post("/login", validationMiddleware(dto.LoginReqDTO), this.controller.login);

        // Refresh token 발급 API
        this.router.post("/refresh", this.controller.refresh);

        // ID 찾기 API
        this.router.post("/find-id", validationMiddleware(dto.EmailReqDTO), this.controller.findMaskingUser);
        this.router.post("/find-id/send-email", validationMiddleware(dto.SendIDReqDTO), this.controller.sendExactUserID);

        // PW 재변경 API
        this.router.post("/change-password", validationMiddleware(dto.ChangePasswordReqDTO), this.controller.changePassword);
        this.router.post("/change-password/send-email", validationMiddleware(dto.EmailReqDTO), this.controller.sendEmailForPassword);
        this.router.post("/change-password/check-email", validationMiddleware(dto.CheckEmailReqDTO), this.controller.checkEmailForPassword);
    }
}

export default new AnonymousRoutes().router;
