// common
import { ErrNotFound } from "@errors/custom";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserRepo from "@repo/user.repo";
import { hashing } from "@src/common/utils/encryption";

export default class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    getUser = async (id: string) => {
        try {
            const user = await this.userRepo.findUserByID(id);
            if (!user) {
                throw new Error(ErrNotFound);
            }
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
            const user = await this.userRepo.findUserByID(targetUserPkID);
            if (!user) {
                throw new Error(ErrNotFound);
            }
            if (userData.email) {
                user.email = userData.email
            }
            if (userData.password) {
                user.password = await hashing(userData.password)
            }
            if (userData.username) {
                user.username = userData.username
            }
            return await this.userRepo.updateUser(user);
        } catch (err) {
            throw err;
        }
    }
}
