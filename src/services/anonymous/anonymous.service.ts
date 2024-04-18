import UserRepo from "@repo/user.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist, ErrNotFound, ErrUnauthorized } from "@errors/handler";
import { compareHashedValue, hashing } from "@utils/encryption";
import { createUserResponse } from "@services/user/user.conv";
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

    // find user by email
    findUserByEmail = async (email: string) => {
        const userList = await this.userRepo.getAllUsers();
        for (const user of userList) {
            if (await compareHashedValue(email, user.email)) {
                return user;
            }
        }
    };

    // find user by email & username
    findUserByEmailUsername = async (email: string, username: string) => {
        const user = await this.userRepo.getUserByUsername(username);
        if (!user) {
            logger.error("cant find user by username");
            throw ErrNotFound;
        }
        if (!(await compareHashedValue(email, user.email))) {
            throw ErrUnauthorized;
        }
        return user;
    };

    findUserByUsername = async (username: string) => {
        return await this.userRepo.getUserByUsername(username);
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
