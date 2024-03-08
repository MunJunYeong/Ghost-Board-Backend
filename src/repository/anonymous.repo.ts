import User from "@models/user";
import { Sequelize } from "sequelize";

export default class AnonymousRepo {
    constructor() {}

    public async createUser(username: string, email: string, password: string): Promise<User> {
        try {
            const user = await User.create({
                username,
                email,
                password,
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}
