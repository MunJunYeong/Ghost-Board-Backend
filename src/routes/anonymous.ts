import { Router } from "express";

import anonymousController from "@controllers/anonymous";
import { validationMiddleware } from "@middlewares/requestValidate";
import { LoginReqDTO } from "@controllers/anonymous/dto";

class AnonymousRoutes {
    router = Router();
    controller = new anonymousController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/login", validationMiddleware(LoginReqDTO), this.controller.login);
    }
}

export default new AnonymousRoutes().router;
