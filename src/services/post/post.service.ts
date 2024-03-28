import { ErrNotFound } from "@errors/handler";
import PostRepo from "@repo/post.repo";
import * as dto from "@controllers/post/dto/post.dto";
import { convToPost } from "./post.conv";
import Post from "@models/post";
import UserRepo from "@repo/user.repo";
import BoardRepo from "@repo/board.repo";
import { logger } from "@configs/logger";

export default class PostService {
    private postRepo: PostRepo;
    private userRepo: UserRepo;
    private boardRepo: BoardRepo;

    constructor() {
        this.postRepo = new PostRepo();
        this.userRepo = new UserRepo();
        this.boardRepo = new BoardRepo();
    }

    createPost = async (postData: dto.CreatePostReqDTO, boardId: number, userId: number): Promise<Post> => {
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

        const newPost = convToPost(postData, boardId, userId);
        return await this.postRepo.createPost(newPost);
    };

    getPostList = async (boardId: number): Promise<Post[]> => {
        // exist board check
        if (!(await this.boardRepo.getBoardByID(boardId))) {
            logger.error(`cant find board data (id - ${boardId})`);
            throw ErrNotFound;
        }

        return await this.postRepo.getPostList(boardId);
    };

    getPost = async (boardId: number, postId: number): Promise<Post> => {
        const post = await this.postRepo.getPost(boardId, postId);
        if (!post) {
            logger.error(`cant find post data (board_id - ${boardId}, post_id - ${postId})`);
            throw ErrNotFound;
        }
        return post;
    };

    updatePost = async (postData: dto.UpdatePostReqDTO, boardId: number, postId: number): Promise<Post> => {
        let p = await this.postRepo.getPost(boardId, postId);
        if (!p) {
            logger.error(`cant find post data (board_id - ${boardId}, post_id - ${postId})`);
            throw ErrNotFound;
        }

        if (postData.title) {
            p.title = postData.title;
        }
        if (postData.description) {
            p.description = postData.description;
        }

        return await this.postRepo.updatePost(p);
    };

    deletePost = async (boardId: number, postId: number): Promise<Boolean> => {
        const result = await this.postRepo.deletePost(boardId, postId);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };
}
