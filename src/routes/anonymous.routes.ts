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

        this.router.post("/login", validationMiddleware(dto.LoginReqDTO), this.controller.login);

        this.router.post("/refresh", this.controller.refresh);

        // email 전송 및 확인
        this.router.post("/email", validationMiddleware(dto.EmailReqDTO), this.controller.sendEmail);
        this.router.post("/email:check", validationMiddleware(dto.CheckEmailReqDTO), this.controller.checkEmail);

        // Email로 회원가입한 모든 정보
        this.router.post("/find-id", validationMiddleware(dto.EmailReqDTO), this.controller.findUserLoginIDList);
        // Email, username으로 회원가입한 정확한 ID 정보를 Email 전송
        this.router.post("/find-id:send", validationMiddleware(dto.SendIDReqDTO), this.controller.sendUserLoginID);
    }
}

export default new AnonymousRoutes().router;
