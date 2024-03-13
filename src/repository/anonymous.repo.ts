import User from "@models/user";

export default class AnonymousRepo {
    constructor() {}

    findUserByUserID = async (userID: string) => {
        return await User.findOne({
            where: {
                userID: userID,
            },
        });
    };
    findUserByEmail = async (email: string) => {
        return await User.findOne({
            where: {
                email: email,
            },
        });
    };

    createUser = async (user: User) => {
        try {
            // TODO: 왜 model로 삽입 시 안되는지 추후에 해결해보기
            // const u = await User.create(user);
            const u = await User.create({
                userID: user.userID,
                username: user.username,
                password: user.password,
                email: user.email,
            });
            return u;
        } catch (err: any) {
            throw err;
        }
    };
}
