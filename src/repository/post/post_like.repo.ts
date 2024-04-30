import { Sequelize } from "sequelize";

import Database from "@configs/database";
import PostLike from "@models/post/post_like";

export default class PostLikeRepo {
    private sequelize: Sequelize;

    constructor() {
        const dbInstance = Database.getInstance();
        this.sequelize = dbInstance.getSequelize();
    }

    getPostLikeCount = async (postId: any) => {
        return await PostLike.count({
            where: {
                postId: postId,
            },
        });
    };

    getPostLike = async (postId: any, userId: any) => {
        return await PostLike.findOne({
            where: {
                postId: postId,
                userId: userId,
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
