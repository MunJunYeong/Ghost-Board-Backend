import { Router } from "express";

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
    }
}

export default new AnonymousRoutes().router;
