import { Router } from "express";

import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/comment/dto/comment.dto";
import CommentController from "@controllers/comment/comment.controller";
import { CreatePostReportReqDTO } from "@controllers/post/dto/post.dto";

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
        this.router.get(`${prefix}/:commentId/like`, this.controller.getCommentLike);
        this.router.post(`${prefix}/:commentId/like`, this.controller.createCommentLike);
        this.router.delete(`${prefix}/:commentId/like`, this.controller.deleteCommentLike);

        // 댓글 신고 API - 우선 DTO가 중복되니 post의 DTO 빌려서 사용 추후 수정
        this.router.post(`${prefix}/:commentId/report`, validationMiddleware(CreatePostReportReqDTO), this.controller.createReport)
    }
}

export default new CommentRoutes().router;
