import { Router } from "express";
import * as dto from "@controllers/post/dto/post.dto";
import PostController from "@controllers/post/post.controller";
import { validationMiddleware } from "@middlewares/requestValidate";

class PostRoutes {
    router = Router();
    controller = new PostController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // prefix - boards/:id/posts

        this.router.post("/", validationMiddleware(dto.CreatePostReqDTO), this.controller.createPost);

        this.router.get("/", this.controller.getPostList);
        this.router.get("/:postId", this.controller.getPost);

        this.router.put("/:postId", validationMiddleware(dto.UpdatePostReqDTO), this.controller.updatePost);

        this.router.delete("/:postId", this.controller.deletePost);
    }
}

export default new PostRoutes().router;
