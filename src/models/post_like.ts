import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import Post from "./post";
import User from "./user";

class PostLike extends Model<InferAttributes<PostLike>, InferCreationAttributes<PostLike>> {
    declare likeId: CreationOptional<number>;
    declare userId: number;
    declare postId: number;
    declare type?: string;
}

export const initPostLike = (sequelize: Sequelize) => {
    PostLike.init(
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
            postId: {
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
            tableName: "post_like",
            timestamps: false,
        }
    );
};

export const relationPostLike = () => {
    // Like 테이블은 User와 Post에 속합니다.
    PostLike.belongsTo(User, { foreignKey: "userId" });
    PostLike.belongsTo(Post, { foreignKey: "postId" });
};

export default PostLike;
