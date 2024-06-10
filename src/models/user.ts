// models/User.ts
import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import Post from "@models/post/post";
import PostLike from "@models/post/post_like";
import PostReport from "@models/post/post_report";
import Comment from "@models/comment/comment";
import CommentLike from "@models/comment/comment_like";
import CommentReport from "@models/comment/comment_report";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare userId: CreationOptional<number>;
    declare id: string;
    declare password: string;
    declare username: string;
    declare email: string;
    declare role: string;
    declare activate?: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            activate: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            tableName: "user",
        }
    );
};

export const relationUser = () => {
    // post
    User.hasMany(Post, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(PostLike, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(PostReport, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });

    // comment
    User.hasMany(Comment, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(CommentLike, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(CommentReport, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
};

export default User;
