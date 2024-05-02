import User from "@models/user";

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

    getUserByEmail = async (email: string) => {
        return await User.findOne({
            where: {
                email: email,
            },
        });
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
