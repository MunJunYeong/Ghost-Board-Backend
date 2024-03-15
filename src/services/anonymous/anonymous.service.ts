import UserRepo from "@src/repository/user.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist } from "@errors/custom";
import { hashing } from "@src/common/utils/encryption";

interface AccessTokenPayload {
    // 알아서 추가할 것
    name: string;
    etc: string;
}

export default class AnonymousService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    signup = async (userDTO: dto.SignupReqDTO) => {
        const user = convSignupToUser(userDTO);

        try {
            // userID / email duplicate check
            if (
                (await this.userRepo.findUserByUserID(user.userID)) ||
                (await this.userRepo.findUserByEmail(user.email))
            ) {
                throw new Error(ErrAlreadyExist);
            }

            // encryption password
            user.password = await hashing(user.password);

            return await this.userRepo.createUser(user);
        } catch (err) {
            throw err;
        }
    };

    login = async (userID: string, pw: string) => {
        //  user login 로직 - DB에 접근하여 id pw 대조
        // 아래는 예시용 payload. 실제로는 user 정보를 넣어야 함.
        const tempPayload: AccessTokenPayload = { name: "aa", etc: "bb" };
        // 성공 했다면 토큰 발행

        return {
            accessToken: issueAccessToken(tempPayload, "1h" /* 이것도 예시임 */),
            refreshToken: issueRefreshToken(),
        };
    };
}
