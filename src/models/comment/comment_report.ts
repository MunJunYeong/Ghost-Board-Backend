import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import User from "../user";
import { ReportReason } from "@models/post/post_report";
import Comment from "./comment";

class CommentReport extends Model<InferAttributes<CommentReport>, InferCreationAttributes<CommentReport>> {
    declare reportId: CreationOptional<number>;
    declare userId: number;
    declare commentId: number;
    declare reason: ReportReason;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export const initCommentReport = (sequelize: Sequelize) => {
    CommentReport.init(
        {
            reportId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            reason: {
                type: DataTypes.ENUM(...Object.values(ReportReason)), // ENUM 타입으로 설정하고 enum 값들을 전달
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
            tableName: "comment_report",
        }
    );
};

export const relationCommentReport = () => {
    // Like 테이블은 User와 Comment에 속합니다.
    CommentReport.belongsTo(User, { foreignKey: "userId" });
    CommentReport.belongsTo(Comment, { foreignKey: "commentId" });
};

export default CommentReport;
