import User from "@models/user";

export default class UserRepo {
    constructor() {}

    createUser = async (user: User) => {
        try {
            // TODO: 왜 model로 삽입 시 안되는지 추후에 해결해보기
            // const u = await User.create(user);
            const u = await User.create({
                id: user.id,
                password: user.password,
                username: user.username,
                email: user.email,
            });
            return u;
        } catch (err: any) {
            throw err;
        }
    };

    getUserByPkID = async (id: any) => {
        return await User.findOne({
            where: {
                userId: id,
            },
        });
    };

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

    deleteUser = async (id: any) => {
        try {
            return await User.destroy({
                where: {
                    userId: id,
                },
            });
        } catch (err) {
            throw err;
        }
    };

    updateUser = async (user: User) => {
        try {
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
        } catch (err) {
            throw err;
        }
    };
}
