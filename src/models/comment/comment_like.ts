import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import User from "../user";
import Comment from "./comment";

class CommentLike extends Model<InferAttributes<CommentLike>, InferCreationAttributes<CommentLike>> {
    declare likeId: CreationOptional<number>;
    declare userId: number;
    declare commentId: number;
    declare type?: string;
}

export const initCommentLike = (sequelize: Sequelize) => {
    CommentLike.init(
        {
            likeId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "comment_like",
            timestamps: false,
        }
    );
};

export const relationCommentLike = () => {
    // Like 테이블은 User와 Comment에 속합니다.
    CommentLike.belongsTo(User, { foreignKey: "userId" });
    CommentLike.belongsTo(Comment, { foreignKey: "commentId" });
};

export default CommentLike;
