import { Router } from "express";

import UserController from "@controllers/user/user.controller";
import PostController from "@controllers/post/post.controller";
import * as dto from "@controllers/user/dto/user.dto";
import { validationMiddleware } from "@middlewares/requestValidate";

class UserRoutes {
    router = Router();
    controller = new UserController();
    postController = new PostController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const prefix = "/users/:userId";
        this.router.get(`${prefix}`, this.controller.getUser);
        this.router.delete(`${prefix}`, this.controller.deleteUser);
        this.router.put(`${prefix}`, validationMiddleware(dto.UpdateUserReqDTO), this.controller.updateUser);

        // user가 쓴 Post list
        this.router.get(`${prefix}/posts`, this.postController.getPostListByUser);
    }
}

export default new UserRoutes().router;
