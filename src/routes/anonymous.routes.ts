import { Request, Response, Router } from "express";

import anonymousController from "@controllers/anonymous/anonymous.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { sendMail } from "@utils/mailer";

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
    }
}

export default new AnonymousRoutes().router;
