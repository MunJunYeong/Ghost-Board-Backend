// common
import { ErrNotFound } from "@errors/handler";
import { hashing } from "@utils/encryption";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserRepo from "@repo/user.repo";
import { deletePassword } from "../common.conv";

export default class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    getUser = async (userID: string) => {
        try {
            const u = await this.userRepo.getUserByPkID(userID);
            if (!u) {
                throw new Error(ErrNotFound);
            }

            const user = deletePassword(u);
            return user;
        } catch (err: any) {
            throw err;
        }
    };

    deleteUser = async (id: string) => {
        try {
            const result = await this.userRepo.deleteUser(id);
            if (result < 1) {
                throw new Error(ErrNotFound);
            }
            return true;
        } catch (err: any) {
            throw err;
        }
    };

    updateUser = async (targetUserPkID: string, userData: dto.UpdateUserReqDTO) => {
        try {
            let u = await this.userRepo.getUserByPkID(targetUserPkID);
            if (!u) {
                throw new Error(ErrNotFound);
            }
            if (userData.email) {
                u.email = userData.email;
            }
            if (userData.password) {
                u.password = await hashing(userData.password);
            }
            if (userData.username) {
                u.username = userData.username;
            }
            u = await this.userRepo.updateUser(u);
            const user = deletePassword(u);
            return user;
        } catch (err) {
            throw err;
        }
    };
}
