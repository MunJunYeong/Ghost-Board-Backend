import User from "@models/user";

export const deletePassword = (user: User) => {
    const userPayload: any = {
        ...user.dataValues,
    };
    const keyToRemove: keyof User = "password";
    delete userPayload[keyToRemove];
    return userPayload;
};
