import Post from "@models/post";

export default class PostRepo {
    constructor() {}

    createPost = async (post: Post) => {
        try {
            return await Post.create({
                title: post.title,
                description: post.description,
                userId: post.userId,
                boardId: post.boardId,
            });
        } catch (err) {
            throw err;
        }
    };

    getPostList = async () => {
        try {
            return await Post.findAll();
        } catch (err) {
            throw err;
        }
    };

    getPost = async (id: string) => {
        try {
            return await Post.findOne({
                where: {
                    postId: id,
                },
            });
        } catch (err) {
            throw err;
        }
    };

    updatePost = async (post: Post) => {
        try {
            const updatedPost = await Post.update(
                {
                    title: post.title,
                    description: post.description,
                    userId: post.userId,
                    boardId: post.boardId,
                },
                {
                    where: {
                        postId: post.postId,
                    },
                }
            );
            if (updatedPost[0] === 1) {
                return post;
            } else {
                throw new Error("cant update post");
            }
        } catch (err) {
            throw err;
        }
    };

    deletePost = async (id: any) => {
        try {
            return await Post.destroy({
                where: {
                    postId: id,
                },
            });
        } catch (err) {
            throw err;
        }
    };
}
