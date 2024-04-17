import UserRepo from "@repo/user.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist, ErrNotFound, ErrUnauthorized } from "@errors/handler";
import { compareHashedValue, hashing } from "@utils/encryption";
import { createUserResponse } from "@services/user/user.conv";
import User from "@models/user";
import { logger } from "@configs/logger";

export default class AnonymousService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    signup = async (userDTO: dto.SignupReqDTO) => {
        let u = convSignupToUser(userDTO);

        // duplicate login id check
        if (await this.userRepo.getUserByID(u.id)) {
            logger.error("cant find user by id");
            throw ErrAlreadyExist;
        }

        // encryption password
        u.password = await hashing(u.password);
        u.email = await hashing(u.email);

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
        const user = await this.userRepo.getUserByUsername(username);
        if (!user) {
            logger.error("cant find user by username");
            throw ErrNotFound;
        }
        if (!(await compareHashedValue(email, user.email))) {
            throw ErrUnauthorized;
        }
        return user.id;
    };

    findLoginID = async (email: string) => {
        const userList = await this.userRepo.getAllUsers();
        if (userList.length < 1) {
            logger.error("cant find all user");
            throw ErrNotFound;
        }

        let matchedUserList = [];
        for (const user of userList) {
            if (await compareHashedValue(email, user.email)) {
                matchedUserList.push({
                    email: email,
                    username: user.username,
                    id: maskLastThreeCharacters(user.id),
                });
            }
        }
        return matchedUserList;
    };

    changePassword = async (username: string, password: string) => {
        let user = await this.userRepo.getUserByUsername(username);
        if (!user) {
            logger.error("cant find user by username");
            throw ErrNotFound;
        }

        // encryption password
        user.password = await hashing(password);

        // update user
        await this.userRepo.updateUser(user);
    };
}

function maskLastThreeCharacters(input: string): string {
    if (input.length <= 3) {
        return input.replace(/./g, "*"); // 문자열 전체를 '*'로 대체
    }

    const visiblePart = input.substring(0, input.length - 3); // 마지막 3개를 제외한 문자열
    const maskedPart = input.substring(input.length - 3).replace(/./g, "*"); // 마지막 3개를 '*'로 대체

    return visiblePart + maskedPart;
}
