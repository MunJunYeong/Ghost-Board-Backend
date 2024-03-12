// models/User.ts
import { Model, DataTypes, Sequelize } from "sequelize";

class User extends Model {
    public id!: number;
    public userID!: string;
    public password!: string;
    public username!: string;
    public email!: string;
}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userID: {
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
        },
        {
            sequelize,
            tableName: "users",
        }
    );
};

export default User;
