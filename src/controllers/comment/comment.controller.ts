import { Request, Response } from "express";

import * as dto from "@controllers/comment/dto/comment.dto";
import CommentService from "@services/comment/comment.service";
import { handleError } from "@errors/error-handler";
import { sendJSONResponse } from "@utils/response";

export default class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    createComment = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const userId = req.user?.userId;
            const body: dto.CreateCommentReqDTO = req.body;

            const result = await this.commentService.createComment(body, userId, postId);
            sendJSONResponse(res, "success create comment", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getCommentList = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const result = await this.commentService.getCommentWithReplies(postId);
            sendJSONResponse(res, `success get comment (postId : ${postId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    updateComment = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;
            const body: dto.CreateCommentReqDTO = req.body;
            const result = await this.commentService.updateComment(body.content, commentId);
            sendJSONResponse(res, `success update comment (commentId : ${commentId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    deleteComment = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;
            const result = await this.commentService.deleteComment(commentId);
            sendJSONResponse(res, `success delete comment (commentId : ${commentId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // like
    getCommentLike = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;

            const result = await this.commentService.getCommentLikeCount(commentId);
            sendJSONResponse(res, "success get comment like", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    createCommentLike = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;
            const userId = req.user?.userId;

            const result = await this.commentService.createCommentLike(commentId, userId);
            sendJSONResponse(res, `success create comment like (commentId : ${commentId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    deleteCommentLike = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;
            const userId = req.user?.userId;

            const result = await this.commentService.deleteCommentLike(commentId, userId);
            sendJSONResponse(res, `success delete comment like (commentId : ${commentId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };
}
