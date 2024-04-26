import { Op, Sequelize } from "sequelize";

import File from "@models/file";
import Post from "@models/post";
import Database from "@configs/database";
import { DeleteS3File } from "@configs/s3";
import PostLike from "@models/post_like";

export default class PostRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    createPost = async (post: Post) => {
        return await post.save();
    };

    createPostWithFile = async (post: Post, file: File) => {
        const transaction = await this.sequelize.transaction();
        try {
            const newPost = await post.save({ transaction });
            file.postId = newPost.postId;
            await file.save({ transaction });

            await transaction.commit();
            return await this.getPostByID(newPost.postId);
        } catch (err: any) {
            await transaction.rollback();
            await DeleteS3File(file.fileName);
            throw err;
        }
    };

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

    getPost = async (postId: number) => {
        return await Post.findOne({
            where: {
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

    deletePost = async (postId: number) => {
        return await Post.destroy({
            where: {
                postId: postId,
            },
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // file table
    createFile = async (link: string, fileName: string, postId: any) => {
        return await File.create({
            link: link,
            fileName: fileName,
            postId: postId,
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // post_like table

    getPostLikeCount = async (postId: any) => {
        return await PostLike.count({
            where: {
                postId: postId,
            },
        });
    };

    createPostLike = async (postId: any, userId: any) => {
        return await PostLike.create({
            postId: postId,
            userId: userId,
        });
    };

    deletePostLike = async (postId: any, userId: any) => {
        return await PostLike.destroy({
            where: {
                postId: postId,
                userId: userId,
            },
        });
    };
}
