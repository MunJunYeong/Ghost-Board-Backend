import User from "@models/user";
import { compareHashedValue } from "@utils/lib/encryption";

export default class UserRepo {
    constructor() {}

    createUser = async (user: User) => {
        const u = await User.create({
            id: user.id,
            password: user.password,
            username: user.username,
            email: user.email,
            role: user.role,
        });
        return u;
    };

    getUserByPkID = async (id: any) => {
        return await User.findOne({
            where: {
                userId: id,
            },
        });
    };

    // not pk, login ID
    getUserByID = async (id: any) => {
        return await User.findOne({
            where: {
                id: id,
            },
        });
    };

    // performance issue - email이 암호화되어져 있어서 모든 user를 순회하며 동일한 email이 있는지 확인해야 함.
    getUserByEmail = async (email: string) => {
        const users = await this.getAllUsers();

        for (const user of users) {
            const isMatch = await compareHashedValue(email, user.email);
            if (isMatch) {
                return user;
            }
        }
        return null; // 일치하는 사용자가 없을 경우 null return
    };

    getUserByUsername = async (username: string) => {
        return await User.findOne({
            where: {
                username: username,
            },
        });
    };

    getAllUsers = async () => {
        return await User.findAll();
    };

    deleteUser = async (id: any) => {
        return await User.destroy({
            where: {
                userId: id,
            },
        });
    };

    updateUser = async (user: User) => {
        const updatedUser = await User.update(
            {
                username: user.username,
                password: user.password,
                email: user.email,
            },
            {
                where: {
                    userId: user.userId, // 사용자의 고유 식별자로 업데이트
                },
            }
        );
        if (updatedUser[0] === 1) {
            return user;
        } else {
            throw new Error("cant update user");
        }
    };
}
