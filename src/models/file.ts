import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

import Post from "./post";

class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
    declare fileId: CreationOptional<number>;
    declare link: string;
    declare fileName: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // relation
    declare postId: number;
}

export const initFile = (sequelize: Sequelize) => {
    File.init(
        {
            fileId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "file",
        }
    );
};

export const relationFile = () => {
    // 관계 설정
    File.belongsTo(Post, { foreignKey: "postId" });
};

export default File;
