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
        this.router.get("/:userId", this.controller.getUser);
        this.router.delete("/:userId", this.controller.deleteUser);
        this.router.put("/:userId", validationMiddleware(dto.UpdateUserReqDTO), this.controller.updateUser);
    }
}

export default new UserRoutes().router;
