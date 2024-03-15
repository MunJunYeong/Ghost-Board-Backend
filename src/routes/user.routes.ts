import { Router } from "express";

import UserController from "@src/controllers/user/user.controller";
class UserRoutes {
    router = Router();
    controller = new UserController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.get("/:id", this.controller.getUser);
        this.router.delete("/:id", this.controller.deleteUser);
    }
}

export default new UserRoutes().router;
