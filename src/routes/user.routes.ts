import { Router } from "express";

import UserController from "@controllers/user/user.controller";
import * as dto from "@controllers/user/dto/user.dto";
import { validationMiddleware } from "@middlewares/requestValidate";

class UserRoutes {
    router = Router();
    controller = new UserController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.get("/:id", this.controller.getUser);
        this.router.delete("/:id", this.controller.deleteUser);
        this.router.put("/:id", validationMiddleware(dto.UpdateUserReqDTO), this.controller.updateUser);
    }
}

export default new UserRoutes().router;
