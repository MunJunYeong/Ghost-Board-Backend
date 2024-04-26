import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

import User from "./user";
import Board from "./board";
import File from "./file";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare postId: CreationOptional<number>;
    declare title: string;
    declare content: string;
    declare author: string;
    declare activate?: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // relation
    declare userId: number;
    declare boardId: number;
}

export const initPost = (sequelize: Sequelize) => {
    Post.init(
        {
            postId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
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
            boardId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "post",
        }
    );
};

export const relationPost = () => {
    // 관계 설정
    Post.belongsTo(User, { foreignKey: "userId" });
    Post.belongsTo(Board, { foreignKey: "boardId" }); // Post는 Board에 속합니다.
    Post.hasOne(File, { foreignKey: "postId" });
};

export default Post;
