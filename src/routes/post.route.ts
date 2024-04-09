import { Router } from "express";
import * as dto from "@controllers/post/dto/post.dto";
import PostController from "@controllers/post/post.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import { uploadMiddleware } from "@middlewares/uploader";

class PostRoutes {
    router = Router();
    private controller: PostController;

    constructor() {
        console.log("controller 호출")
        this.controller = new PostController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const prefix = "/boards/:boardId/posts";

        this.router.post(`${prefix}`, uploadMiddleware.single("image"), validationMiddleware(dto.CreatePostReqDTO), this.controller.createPost);

        this.router.get(`${prefix}`, this.controller.getPostList);
        this.router.get(`${prefix}/:postId`, this.controller.getPost);

        this.router.put(`${prefix}/:postId`, validationMiddleware(dto.UpdatePostReqDTO), this.controller.updatePost);

        this.router.delete(`${prefix}/:postId`, this.controller.deletePost);
    }
}

export default new PostRoutes().router;
