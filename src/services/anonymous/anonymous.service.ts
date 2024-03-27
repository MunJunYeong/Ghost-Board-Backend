import UserRepo from "@src/repository/user.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist, ErrNotFound } from "@errors/handler";
import { comparePassword, hashing } from "@utils/encryption";
import { deletePassword } from "../common.conv";

export default class AnonymousService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    signup = async (userDTO: dto.SignupReqDTO) => {
        let u = convSignupToUser(userDTO);

        // userID / email duplicate check
        if ((await this.userRepo.getUserByID(u.id)) || (await this.userRepo.getUserByEmail(u.email))) {
            throw new Error(ErrAlreadyExist);
        }

        // encryption password
        u.password = await hashing(u.password);
        u = await this.userRepo.createUser(u);

        const user = deletePassword(u);
        return user;
    };

    login = async (loginData: dto.LoginReqDTO): Promise<dto.LoginResDTO> => {
        const { id, password } = loginData;
        const u = await this.userRepo.getUserByID(id);
        // login validation - id and compare password
        if (!u || !(await comparePassword(password, u.password))) {
            throw new Error(ErrNotFound);
        }

        const user = deletePassword(u);

        const result: dto.LoginResDTO = {
            accessToken: issueAccessToken(user),
            refreshToken: issueRefreshToken(),
        };
        return result;
    };
}
