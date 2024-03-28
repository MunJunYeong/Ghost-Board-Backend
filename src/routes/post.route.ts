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

        this.router.post("/boards/:boardId/posts", validationMiddleware(dto.CreatePostReqDTO), this.controller.createPost);

        this.router.get("/boards/:boardId/posts", this.controller.getPostList);
        this.router.get("/boards/:boardId/posts/:postId", this.controller.getPost);

        this.router.put("/boards/:boardId/posts/:postId", validationMiddleware(dto.UpdatePostReqDTO), this.controller.updatePost);

        this.router.delete("/boards/:boardId/posts/:postId", this.controller.deletePost);
    }
}

export default new PostRoutes().router;
