import { UserResponseDTO } from "@controllers/user/dto/user.dto";
import User from "@models/user";

// 로그인 시 password와 같은 정보를 제거하기 위함
export const createUserResponse = (user: User) => {
    const userResponse: UserResponseDTO = {
        userId: user.userId,
        id: user.id,
        username: user.username,
        email: user.email,
        activate: user.activate ?? true,
        role: user.role,
    };
    return userResponse;
};
