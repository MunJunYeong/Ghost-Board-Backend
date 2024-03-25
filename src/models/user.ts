// models/User.ts
import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes, CreationOptional } from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare userId: CreationOptional<number>;
    declare id: string;
    declare password: string;
    declare username: string;
    declare email: string;
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
                allowNull: false,
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

export default User;
