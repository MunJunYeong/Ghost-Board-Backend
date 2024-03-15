import { ErrNotFound } from "@src/common/errors/custom";
import UserRepo from "@src/repository/user.repo";

export default class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    deleteUser = async (id: string) => {
        try {
            // precheck가 필요한가 ?
            if (await this.userRepo.findUserByID(id)) {
                throw new Error(ErrNotFound);
            }

            await this.userRepo.deleteUserByID(id);
        } catch (err) {
            throw err;
        }
    };
}
