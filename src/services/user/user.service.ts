// common
import { ErrNotFound } from "@errors/custom";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserRepo from "@repo/user.repo";
import { hashing } from "@utils/encryption";
import { deletePassword } from "../common.conv";

export default class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    getUser = async (id: string) => {
        try {
            const u = await this.userRepo.findUserByID(id);
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
            // TODO: 고민해보기 - precheck가 필요한가 ?
            if (!(await this.userRepo.findUserByID(id))) {
                throw new Error(ErrNotFound);
            }

            await this.userRepo.deleteUserByID(id);
        } catch (err: any) {
            throw err;
        }
    };

    updateUser = async (targetUserPkID: string, userData: dto.UpdateUserReqDTO) => {
        try {
            let u = await this.userRepo.findUserByID(targetUserPkID);
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
