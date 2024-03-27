import { ErrNotFound } from "@errors/handler";
import PostRepo from "@repo/post.repo";
import * as dto from "@controllers/post/dto/post.dto";
import { convToPost } from "./post.conv";
import Post from "@models/post";

export default class PostService {
    private postRepo: PostRepo;

    constructor() {
        this.postRepo = new PostRepo();
    }

    createPost = async (postData: dto.CreatePostReqDTO, boardId: number, userId: number): Promise<Post> => {
        const newPost = convToPost(postData, boardId, userId);

        return await this.postRepo.createPost(newPost);
    };

    getPostList = async (boardId: number): Promise<Post[]> => {
        return await this.postRepo.getPostList(boardId);
    };

    getPost = async (boardId: number, postId: number): Promise<Post> => {
        const post = await this.postRepo.getPost(boardId, postId);
        if (!post) {
            throw ErrNotFound;
        }
        return post;
    };

    updatePost = async (postData: dto.UpdatePostReqDTO, boardId: number, postId: number): Promise<Post> => {
        let p = await this.postRepo.getPost(boardId, postId);
        if (!p) {
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
