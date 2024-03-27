import { Request, Response } from "express";

import * as dto from "@controllers/post/dto/post.dto";
import { handleError } from "@errors/handler";
import PostService from "@services/post/post.service";
import { sendJSONResponse } from "@utils/response";

export default class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    createPost = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.id;
            const userId = req.user?.userId;
            const body: dto.CreatePostReqDTO = req.body;
            const result = await this.postService.createPost(body, Number(boardId), Number(userId));
            sendJSONResponse(res, "success create post", result.toJSON());
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getPostList = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.id;

            const result = await this.postService.getPostList(Number(boardId));
            sendJSONResponse(res, "success get post list", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    getPost = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.boardId;
            const postId = req.params.postId;

            const result = await this.postService.getPost(Number(boardId), Number(postId));
            sendJSONResponse(res, "success get post", result.toJSON());
        } catch (err: any) {
            throw handleError(err);
        }
    };
    updatePost = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.boardId;
            const postId = req.params.postId;
            const body: dto.UpdatePostReqDTO = req.body;

            const result = await this.postService.updatePost(body, Number(boardId), Number(postId));
            sendJSONResponse(res, "success update boards", result.toJSON());
        } catch (err: any) {
            throw handleError(err);
        }
    };

    deletePost = async (req: Request, res: Response) => {
        try {
            const boardId = req.params.boardId;
            const postId = req.params.postId;

            const result = await this.postService.deletePost(Number(boardId), Number(postId));
            sendJSONResponse(res, "success get boards", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };
}
