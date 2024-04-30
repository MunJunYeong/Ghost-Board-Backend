import { Router } from "express";

import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/comment/dto/comment.dto";
import CommentController from "@controllers/comment/comment.controller";

class CommentRoutes {
    router = Router();
    controller = new CommentController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const prefix = "/boards/:boardId/posts/:postId/comments";
                     
        // Create 댓글  API
        this.router.post(`${prefix}`, validationMiddleware(dto.CreateCommentReqDTO), this.controller.createComment);

        // Get 댓글  API
        this.router.get(`${prefix}`, this.controller.getCommentList);

        // Update 댓글  API
        this.router.put(`${prefix}/:commentId`, validationMiddleware(dto.CreateCommentReqDTO), this.controller.updateComment);

        // delete 댓글  API
        this.router.delete(`${prefix}/:commentId`, this.controller.deleteComment);

        // 좋아요 API
        this.router.post(`${prefix}/:commentId/like`, this.controller.createCommentLike);

    }
}

export default new CommentRoutes().router;
