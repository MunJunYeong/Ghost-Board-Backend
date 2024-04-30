import { Sequelize } from "sequelize";

import Database from "@configs/database";
import CommentLike from "@models/comment/comment_like";

export default class CommentLikeRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    getCommentLikeCount = async (commentId: any) => {
        return await CommentLike.count({
            where: {
                commentId: commentId,
            },
        });
    };

    getCommentLike = async (commentId: any, userId: any) => {
        return await CommentLike.findOne({
            where: {
                commentId: commentId,
                userId: userId,
            },
        });
    };

    createCommentLike = async (commentId: any, userId: any) => {
        return await CommentLike.create({
            commentId: commentId,
            userId: userId,
        });
    };

    deleteCommentLike = async (commentId: any, userId: any) => {
        return await CommentLike.destroy({
            where: {
                commentId: commentId,
                userId: userId,
            },
        });
    };
}
