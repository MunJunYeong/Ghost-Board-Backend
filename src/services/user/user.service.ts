// common
import { ErrNotFound } from "@errors/error-handler";
import { hashing } from "@utils/lib/encryption";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserRepo from "@repo/user.repo";
import { createUserResponse } from "./user.conv";

export default class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    getUser = async (userID: any) => {
        const u = await this.userRepo.getUserByPkID(userID);
        if (!u) {
            throw ErrNotFound;
        }

        return createUserResponse(u);
    };

    deleteUser = async (id: string) => {
        const result = await this.userRepo.deleteUser(id);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };

    updateUser = async (targetUserPkID: string, userData: dto.UpdateUserReqDTO) => {
        let u = await this.userRepo.getUserByPkID(targetUserPkID);
        if (!u) {
            throw ErrNotFound;
        }
        if (userData.password) {
            u.password = await hashing(userData.password);
        }
        if (userData.username) {
            u.username = userData.username;
        }
        u = await this.userRepo.updateUser(u);
        return createUserResponse(u);
    };
}
