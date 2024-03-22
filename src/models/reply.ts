import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

import User from "./user";
import Comment from "./comment";

class Reply extends Model<InferAttributes<Reply>, InferCreationAttributes<Reply>> {
    declare replyId: CreationOptional<number>;
    declare content: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // relation
    declare userId: number;
    declare commentId: number;
}

export const initReply = (sequelize: Sequelize) => {
    Reply.init(
        {
            replyId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            content: {
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
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "reply",
        }
    );

    // 관계 설정
    Reply.belongsTo(User, { foreignKey: "userId" });
    Reply.belongsTo(Comment, { foreignKey: "commentId" });
};

export default Reply;
