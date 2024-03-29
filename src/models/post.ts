import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

import User from "./user";
import Board from "./board";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare postId: CreationOptional<number>;
    declare title: string;
    declare description: string;
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
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
    // 관계 설정
    Post.belongsTo(User, { foreignKey: "userId" });
    Post.belongsTo(Board, { foreignKey: "boardId" }); // Post는 Board에 속합니다.
};

export default Post;
