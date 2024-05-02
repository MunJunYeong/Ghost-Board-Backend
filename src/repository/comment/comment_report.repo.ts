import { Sequelize } from "sequelize";

import Database from "@configs/database";
import CommentReport from "@models/comment/comment_report";

export default class CommentReportRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    getCommentReportCount = async (commentId: any) => {
        return await CommentReport.count({
            where: {
                commentId: commentId,
            },
        });
    };

    getCommentReport = async (commentId: any, userId: any) => {
        return await CommentReport.findOne({
            where: {
                commentId: commentId,
                userId: userId,
            },
        });
    };

    createCommentReport = async (commentId: any, userId: any, reason: any) => {
        return await CommentReport.create({
            commentId: commentId,
            userId: userId,
            reason: reason,
        });
    };
}
