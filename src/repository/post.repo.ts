import Post from "@models/post";

export default class PostRepo {
    constructor() {}

    createPost = async (post: Post) => {
        return await Post.create({
            title: post.title,
            description: post.description,
            userId: post.userId,
            boardId: post.boardId,
        });
    };

    getPostList = async (boardId: any) => {
        return await Post.findAll({
            where: {
                boardId: boardId,
            },
        });
    };

    getPost = async (boardId: number, postId: number) => {
        return await Post.findOne({
            where: {
                boardId: boardId,
                postId: postId,
            },
        });
    };

    getPostByID = async (postId: number) => {
        return await Post.findOne({
            where: {
                postId: postId,
            },
        });
    };

    updatePost = async (post: Post) => {
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
    };

    deletePost = async (boardId: number, postId: number) => {
        return await Post.destroy({
            where: {
                boardId: boardId,
                postId: postId,
            },
        });
    };
}
