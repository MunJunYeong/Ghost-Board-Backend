import { Router } from "express";
import * as dto from "@controllers/post/dto/post.dto";
import PostController from "@controllers/post/post.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import { uploadMiddleware } from "@middlewares/uploader";

class PostRoutes {
    router = Router();
    private controller: PostController;

    constructor() {
        this.controller = new PostController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const prefix = "/boards/:boardId/posts";

        // Create 게시글  API
        this.router.post(`${prefix}`, uploadMiddleware.single("image"), validationMiddleware(dto.CreatePostReqDTO), this.controller.createPost);
        
        // Get 게시글  API
        this.router.get(`${prefix}`, this.controller.getPostList);
        this.router.get(`${prefix}/:postId`, this.controller.getPost);
        
        // Update 게시글  API
        this.router.put(`${prefix}/:postId`, validationMiddleware(dto.UpdatePostReqDTO), this.controller.updatePost);
        
        // Delete 게시글  API
        this.router.delete(`${prefix}/:postId`, this.controller.deletePost);

        // 좋아요 API
        this.router.get(`${prefix}/:postId/like`, this.controller.getPostLike);
        this.router.post(`${prefix}/:postId/like`, this.controller.createPostLike);
        this.router.delete(`${prefix}/:postId/like`, this.controller.deletePostLike);

        // 게시글 신고 API
        this.router.post(`${prefix}/:postId/report`, validationMiddleware(dto.CreatePostReportReqDTO), this.controller.createReport)
    }
}

export default new PostRoutes().router;
