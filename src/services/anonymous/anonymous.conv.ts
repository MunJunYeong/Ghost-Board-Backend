import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import User from "@models/user";

export const convSignupToUser = (userDTO: dto.SignupReqDTO): User => {
    const user = new User();
    user.userID = userDTO.userID;
    user.password = userDTO.password;
    user.username = userDTO.username;
    user.email = userDTO.email;
    return user;
};
