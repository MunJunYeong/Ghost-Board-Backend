import { UserResponseDTO } from "@controllers/user/dto/user.dto";
import User from "@models/user";

export const createUserResponse = (user: User) => {
    const userResponse: UserResponseDTO = {
        userId: user.userId,
        id: user.id,
        username: user.username,
        email: user.email
    };
    return userResponse;
};
