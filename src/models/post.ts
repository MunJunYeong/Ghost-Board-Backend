import { Model, DataTypes, Sequelize } from "sequelize";

import User from "./user";

class Post extends Model {
    public id!: number;
    public title!: string;
    public content!: string;
}

export const initPost = (sequelize: Sequelize) => {
    Post.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        }, 
        {
            sequelize,
            tableName: "posts",
        }
    );
    // 관계 설정
    Post.belongsTo(User, { foreignKey: "userId" });
};

export default Post;
