import fs from "fs";

import { ErrNotFound } from "@errors/handler";
import { logger } from "@configs/logger";
import { S3Storage, S3Configs } from "@configs/s3";
import * as dto from "@controllers/post/dto/post.dto";
import Post from "@models/post";
import PostRepo from "@repo/post.repo";
import UserRepo from "@repo/user.repo";
import BoardRepo from "@repo/board.repo";
import { convToPost } from "./post.conv";
import Database from "@configs/database";
import { Sequelize } from "sequelize";

export default class PostService {
    private postRepo: PostRepo;
    private userRepo: UserRepo;
    private boardRepo: BoardRepo;
    private sequelize: Sequelize;

    constructor() {
        this.postRepo = new PostRepo();
        this.userRepo = new UserRepo();
        this.boardRepo = new BoardRepo();
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    createPost = async (postData: dto.CreatePostReqDTO, boardId: any, userId: any) => {
        // exist board check
        if (!(await this.boardRepo.getBoardByID(boardId))) {
            logger.error(`cant find board data (id - ${boardId})`);
            throw ErrNotFound;
        }
        // exist user check
        if (!(await this.userRepo.getUserByPkID(userId))) {
            logger.error(`cant find user data (id - ${userId})`);
            throw ErrNotFound;
        }

        let postId: any;
        await this.sequelize.transaction(async (t) => {
            try {
                const newPost = await this.postRepo.createPost(convToPost(postData, boardId, userId));
                // post에 저장할 사진이 있는 경우
                if (postData.image) {
                    const fileContent: Buffer = fs.readFileSync(postData.image.path);
                    const params: {
                        Bucket: string;
                        Key: string;
                        Body: Buffer;
                    } = {
                        Bucket: S3Configs.s3Bucket,
                        Key: postData.image.filename,
                        Body: fileContent,
                    };
                    // s3 업로드
                    const result = await S3Storage.upload(params).promise();
                    await this.postRepo.createFile(result.Location, postData.image.filename, newPost.postId);

                    // S3 업로드 성공 후 로컬 디스크에서 파일 삭제
                    fs.unlinkSync(postData.image.path);

                    postId = newPost.postId;
                    await t.commit();
                }
            } catch (err: any) {
                await t.rollback();
                logger.error("Transaction rolled back due to an error:", err);
                throw err;
            }
        });

        const post = await this.postRepo.getPostByID(postId);
        if (!post) {
            throw new Error("unhandled error - transaction doesn't catch error");
        }
        return post;
    };

    getPostList = async (boardId: any, postId: any | undefined) => {
        // exist board check
        if (!(await this.boardRepo.getBoardByID(boardId))) {
            logger.error(`cant find board data (id - ${boardId})`);
            throw ErrNotFound;
        }

        let postList: Post[];
        if (postId) {
            postList = await this.postRepo.getPostListAfterCursor(boardId, postId);
        } else {
            postList = await this.postRepo.getPostList(boardId);
        }

        let nextCursor: number = 0;
        if (postList.length > 0) {
            nextCursor = postList[postList.length - 1].postId;
        }

        return { posts: postList, nextCursor };
    };

    getPost = async (boardId: any, postId: any): Promise<Post> => {
        const post = await this.postRepo.getPost(boardId, postId);
        if (!post) {
            logger.error(`cant find post data (board_id - ${boardId}, post_id - ${postId})`);
            throw ErrNotFound;
        }
        return post;
    };

    updatePost = async (postData: dto.UpdatePostReqDTO, boardId: any, postId: any): Promise<Post> => {
        let p = await this.postRepo.getPost(boardId, postId);
        if (!p) {
            logger.error(`cant find post data (board_id - ${boardId}, post_id - ${postId})`);
            throw ErrNotFound;
        }

        if (postData.title) {
            p.title = postData.title;
        }
        if (postData.content) {
            p.content = postData.content;
        }

        return await this.postRepo.updatePost(p);
    };

    deletePost = async (boardId: any, postId: any): Promise<Boolean> => {
        const result = await this.postRepo.deletePost(boardId, postId);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };
}
