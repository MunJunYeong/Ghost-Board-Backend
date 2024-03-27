import { ErrNotFound } from "@errors/handler";
import Post from "@models/post";
import PostRepo from "@repo/post.repo";

export default class PostService {
    private postRepo: PostRepo;

    constructor() {
        this.postRepo = new PostRepo();
    }

    // TODO: params 변경
    createPost = async (model: any) => {
        // TODO: conv
        const tempPost = new Post();

        await this.postRepo.createPost(tempPost);
    };

    getPostList = async () => {
        return await this.postRepo.getPostList();
    };

    getPost = async (id: string) => {
        const post = await this.postRepo.getPost(id);
        if (!post) {
            throw new Error(ErrNotFound);
        }
        return post;
    };

    // TODO: params 변경
    updatePost = async (targetPostPkID: string, postData: any) => {
        let p = await this.postRepo.getPost(targetPostPkID);
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
}
