import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

import User from "../user";
import Post from "../post/post";

class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    declare commentId: CreationOptional<number>;
    declare content: string;
    declare author: string;
    declare activate?: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // relation
    declare userId: number;
    declare postId: number;
    declare parentId: number | null;
}

export const initComment = (sequelize: Sequelize) => {
    Comment.init(
        {
            commentId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            activate: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true, // 대댓글일 경우에만 null이 아닌 부모 댓글의 id를 가짐
            },
        },
        {
            sequelize,
            tableName: "comment",
        }
    );
};

export const relationComment = () => {
    Comment.belongsTo(User, { foreignKey: "userId" });
    Comment.belongsTo(Post, { foreignKey: "postId" });

    // 대댓글 관계 설정
    Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
};

export default Comment;
