import { Router } from "express";

import UserController from "@controllers/user/user.controller";
import * as dto from "@controllers/user/dto/user.dto";
import { validationMiddleware } from "@middlewares/requestValidate";

class UserRoutes {
    router = Router();
    controller = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // prefix - boards
        const prefix = "/users";
        this.router.get(`${prefix}/:userId`, this.controller.getUser);
        this.router.delete(`${prefix}/:userId`, this.controller.deleteUser);
        this.router.put(`${prefix}/:userId`, validationMiddleware(dto.UpdateUserReqDTO), this.controller.updateUser);
    }
}

export default new UserRoutes().router;
