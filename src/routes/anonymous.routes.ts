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

        // ID 찾기
        this.router.post("/find-id", validationMiddleware(dto.FindIDReqDTO), this.controller.findUserLoginID);

        // 관리자 기능으로 username도 기억이 안날 경우에 모든 user를 순회하며 ID를 찾아 이메일로 보내주는 로직
        this.router.post("/find-id:admin", validationMiddleware(dto.FindIDAdminReqDTO), this.controller.findUserLoginIDForAdmin);

    }
}

export default new AnonymousRoutes().router;
