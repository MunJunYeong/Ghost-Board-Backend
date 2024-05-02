import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import User from "@models/user";
import { Permission } from "@utils/enums";

export const convSignupToUser = (userDTO: dto.SignupReqDTO): User => {
    return new User({
        id: userDTO.id,
        password: userDTO.password,
        username: userDTO.username,
        email: userDTO.email,
        role: Permission.USER,
    });
};
