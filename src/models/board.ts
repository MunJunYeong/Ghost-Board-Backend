import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";
import Post from "./post/post";

class Board extends Model<InferAttributes<Board>, InferCreationAttributes<Board>> {
    declare boardId: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export const initBoard = (sequelize: Sequelize) => {
    Board.init(
        {
            boardId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                unique: true,
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
        },
        {
            sequelize,
            tableName: "board",
        }
    );
};

export const relationBoard = () => {
    Board.hasMany(Post, {
        foreignKey: "boardId",
        onDelete: "CASCADE",
    });
};

export default Board;
