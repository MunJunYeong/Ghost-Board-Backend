import { Request, Response } from "express";

import * as dto from "@controllers/post/dto/post.dto";
import { handleError } from "@errors/error-handler";
import PostService from "@services/post/post.service";
import { sendJSONResponse } from "@utils/response";
import { PaginationReqDTO } from "@controllers/common.dto";
import { createOffsetQueyr } from "@utils/query";

export default class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    createPost = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.boardId;
            const userId = req.user?.userId;
            const body: dto.CreatePostReqDTO = req.body;
            body.image = req.file as any;

            const result = await this.postService.createPost(body, boardId, userId);
            sendJSONResponse(res, "success create post", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getDeactivatePostList = async (req: Request, res: Response) => {
        try {
            const pagination: PaginationReqDTO = createOffsetQueyr(req.query);

            const result = await this.postService.getDeactivatePostList(pagination);
            sendJSONResponse(res, "success get deactivate post list", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getPostList = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.boardId;
            // cursor
            const postId = req.query.postId;

            const result = await this.postService.getPostList(boardId, postId);
            sendJSONResponse(res, "success get post list", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getPost = async (req: Request, res: Response) => {
        try {
            // const boardId = req.params.boardId;
            const postId = req.params.postId;
            const userId = req.user?.userId;

            const result = await this.postService.getPost(userId, postId);
            sendJSONResponse(res, `success get post (post_id : ${postId})`, result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    updatePost = async (req: Request, res: Response) => {
        try {
            // const boardId = req.params.boardId;
            const postId = req.params.postId;
            const body: dto.UpdatePostReqDTO = req.body;

            const result = await this.postService.updatePost(body, postId);
            sendJSONResponse(res, "success update boards", result.toJSON());
        } catch (err: any) {
            throw handleError(err);
        }
    };

    deletePost = async (req: Request, res: Response) => {
        try {
            // const boardId = req.params.boardId; 실제로 boardID는 사용하지 않음.
            const postId = req.params.postId;

            const result = await this.postService.deletePost(postId);
            sendJSONResponse(res, "success get boards", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getPostListByUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const pagination: PaginationReqDTO = createOffsetQueyr(req.query);

            const result = await this.postService.getPostListByUser(userId, pagination);
            sendJSONResponse(res, "success get boards", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // like
    getPostLike = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const result = await this.postService.getPostLikeCount(postId);
            sendJSONResponse(res, "success get post like", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    createPostLike = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const userId = req.user?.userId;

            await this.postService.createPostLike(postId, userId);
            sendJSONResponse(res, "success create post like", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    deletePostLike = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const userId = req.user?.userId;

            await this.postService.deletePostLike(postId, userId);
            sendJSONResponse(res, "success delete post like", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // report
    createReport = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const userId = req.user?.userId;
            const body: dto.CreatePostReportReqDTO = req.body;

            await this.postService.createPostReport(postId, userId, body.reason);
            sendJSONResponse(res, "success create post report", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };
}
