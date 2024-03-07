import { Router } from "express";
import anonymousController from "@controllers/anonymous";

class AnonymousRoutes {
    router = Router();
    controller = new anonymousController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/login", this.controller.login);
    }
}

export default new AnonymousRoutes().router;
