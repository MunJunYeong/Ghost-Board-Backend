import UserRepo from "@repo/user.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist, ErrNotFound, ErrUnauthorized } from "@errors/handler";
import { compareHashedValue, hashing } from "@utils/encryption";
import { createUserResponse } from "@services/user/user.conv";
import User from "@models/user";

export default class AnonymousService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    signup = async (userDTO: dto.SignupReqDTO) => {
        let u = convSignupToUser(userDTO);

        // userID / email duplicate check
        u.email = await hashing(u.email);
        if ((await this.userRepo.getUserByID(u.id)) || (await this.userRepo.getUserByEmail(u.email))) {
            throw ErrAlreadyExist;
        }

        // encryption password
        u.password = await hashing(u.password);

        u = await this.userRepo.createUser(u);

        const user = createUserResponse(u);
        return user;
    };

    login = async (loginData: dto.LoginReqDTO): Promise<dto.LoginResDTO> => {
        const { id, password } = loginData;
        const u = await this.userRepo.getUserByID(id);
        // login validation - id and compare password
        if (!u || !(await compareHashedValue(password, u.password))) {
            throw ErrNotFound;
        }

        const user = createUserResponse(u);
        const result: dto.LoginResDTO = {
            accessToken: issueAccessToken(user),
            refreshToken: issueRefreshToken(),
        };
        return result;
    };

    // user의 PK ID가 아닌 로그인 ID를 의미함
    findLoginIDByUsername = async (email: string, username: string) => {
        const user = await this.userRepo.getUserByUsername(username)
        if (!user) {
            throw ErrNotFound
        }
        if (!await compareHashedValue(email, user.email)) {
            throw ErrUnauthorized
        }
        return user.id
    }

    findLoginID = async (email: string) => {
        const userList = await this.userRepo.getAllUsers();
        if (userList.length < 1) {
            throw ErrNotFound
        }

        let targetID;
        for (const user of userList) {
            if (await compareHashedValue(email, user.email)) {
                targetID = user.id;
                break;
            }
        }
        return targetID
    }

}
