import { Sequelize } from "sequelize";

import Database from "@configs/database";
import PostReport from "@models/post_report";

export default class PostReportRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    getPostReportCount = async (postId: any) => {
        return await PostReport.count({
            where: {
                postId: postId,
            },
        });
    };

    getPostLike = async (postId: any, userId: any) => {
        return await PostReport.findOne({
            where: {
                postId: postId,
                userId: userId,
            },
        });
    };

    createPostLike = async (postId: any, userId: any, reason: any) => {
        return await PostReport.create({
            postId: postId,
            userId: userId,
            reason: reason,
        });
    };
}
