import { Op, Sequelize } from "sequelize";

import File from "@models/file";
import Post from "@models/post";
import Database from "@configs/database";

export default class PostRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    createFile = async (link: string, fileName: string, postId: any) => {
        return await File.create({
            link: link,
            fileName: fileName,
            postId: postId,
        });
    };

    createPost = async (post: Post) => {
        return await post.save();
    };

    createPostWithFile = async (post: Post, file: File) => {
        const transaction = await this.sequelize.transaction();
        try {
            const newPost = await post.save({transaction})
            file.postId = newPost.postId;
            await file.save({transaction})
            
            await transaction.commit();
            return await this.getPostByID(newPost.postId)
        } catch (err: any) {
            await transaction.rollback();
            throw err;
        }
    }

    getPostList = async (boardId: any) => {
        return await Post.findAll({
            where: {
                boardId: boardId,
            },
            include: [File],
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
            include: [File],
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
            include: [File],
        });
    };

    getPostByID = async (postId: number) => {
        return await Post.findOne({
            where: {
                postId: postId,
            },
            include: [File],
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
