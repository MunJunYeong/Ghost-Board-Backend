import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import Post from "./post";
import User from "../user";

export enum ReportReason {
    NotLiked = "마음에들지않아요",
    Inappropriate = "선정적이에요",
    IncitementOfTerror = "테러를조장해요",
    InappropriateContent = "부적절해요",
    Spam = "스팸이에요",
    HateSpeech = "혐오발언이에요",
    AggressiveContent = "공격적인내용이있어요",
    FalseInformation = "거짓정보가포함돼있어요",
}

class PostReport extends Model<InferAttributes<PostReport>, InferCreationAttributes<PostReport>> {
    declare reportId: CreationOptional<number>;
    declare userId: number;
    declare postId: number;
    declare reason: ReportReason;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export const initPostReport = (sequelize: Sequelize) => {
    PostReport.init(
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
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "post_report",
        }
    );
};

export const relationPostReport = () => {
    // Like 테이블은 User와 Post에 속합니다.
    PostReport.belongsTo(User, { foreignKey: "userId" });
    PostReport.belongsTo(Post, { foreignKey: "postId" });
};

export default PostReport;
