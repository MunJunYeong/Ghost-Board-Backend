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

        this.router.post(`${prefix}`, validationMiddleware(dto.CreateCommentReqDTO), this.controller.createComment);
        this.router.get(`${prefix}`, this.controller.getCommentList);
        this.router.put(`${prefix}/:commentId`, validationMiddleware(dto.CreateCommentReqDTO), this.controller.updateComment);
        this.router.delete(`${prefix}/:commentId`, this.controller.deleteComment);
    }
}

export default new CommentRoutes().router;
