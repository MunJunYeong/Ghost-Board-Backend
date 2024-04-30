import { Sequelize } from "sequelize";

import Database from "@configs/database";
import PostReport from "@models/post/post_report";

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

    getPostReport = async (postId: any, userId: any) => {
        return await PostReport.findOne({
            where: {
                postId: postId,
                userId: userId,
            },
        });
    };

    createPostReport = async (postId: any, userId: any, reason: any) => {
        return await PostReport.create({
            postId: postId,
            userId: userId,
            reason: reason,
        });
    };
}
