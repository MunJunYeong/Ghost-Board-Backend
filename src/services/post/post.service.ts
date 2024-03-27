import { ErrNotFound } from "@errors/handler";
import Post from "@models/post";
import PostRepo from "@repo/post.repo";
import * as dto from "@controllers/post/dto/post.dto";
import { convToPost } from "./post.conv";

export default class PostService {
    private postRepo: PostRepo;

    constructor() {
        this.postRepo = new PostRepo();
    }

    createPost = async (postData: dto.CreatePostReqDTO, boardId: number, userId: number) => {
        const newPost = convToPost(postData, boardId, userId);

        return await this.postRepo.createPost(newPost);
    };

    getPostList = async (boardId: number) => {
        return await this.postRepo.getPostList(boardId);
    };

    getPost = async (boardId: number, postId: number) => {
        const post = await this.postRepo.getPost(boardId, postId);
        if (!post) {
            throw new Error(ErrNotFound);
        }
        return post;
    };

    updatePost = async (postData: dto.UpdatePostReqDTO, boardId: number, postId: number) => {
        let p = await this.postRepo.getPost(boardId, postId);
        if (!p) {
            throw new Error(ErrNotFound);
        }
        if (postData.title) {
            p.title = postData.title;
        }
        if (postData.description) {
            p.description = postData.description;
        }

        p = await this.postRepo.updatePost(p);
        return p;
    };

    deletePost = async (boardId: number, postId: number) => {
        const result = await this.postRepo.deletePost(boardId, postId);
        if (result < 1) {
            throw new Error(ErrNotFound);
        }
        return true;
    };
}
