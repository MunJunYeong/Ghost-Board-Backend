import File from "@models/file";
import Post from "@models/post";
import { Op } from "sequelize";

export default class PostRepo {
    constructor() {}

    createFile = async (link: string, name: string, postId: any) => {
        return await File.create({
            link: link,
            name: name,
            postId: postId,
        });
    };
    
    createPost = async (post: Post) => {
        return await Post.create({
            title: post.title,
            content: post.content,
            userId: post.userId,
            boardId: post.boardId,
        });
    };

    getPostList = async (boardId: any) => {
        return await Post.findAll({
            where: {
                boardId: boardId,
            },
            include : [File],
            limit: 10,
            order: [["created_at", "DESC"]],
        });
    };

    getPostListAfterCursor = async (boardId: any, postId: any) => {
        return await Post.findAll({
            where: {
                boardId: boardId,
                postId: { [Op.lt]: postId }, //  [Op.lte]:10,   < 10
            },
            include : [File],
            limit: 10,
            order: [["created_at", "DESC"]],
        });
    };

    getPost = async (boardId: number, postId: number) => {
        return await Post.findOne({
            where: {
                boardId: boardId,
                postId: postId,
            },
            include : [File],
        });
    };

    getPostByID = async (postId: number) => {
        return await Post.findOne({
            where: {
                postId: postId,
            },
            include : [File],
        });
    };

    updatePost = async (post: Post) => {
        const updatedPost = await Post.update(
            {
                title: post.title,
                content: post.content,
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
