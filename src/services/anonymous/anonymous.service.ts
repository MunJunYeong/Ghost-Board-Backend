import AnonymousRepo from "@repo/anonymous.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { convSignupToUser } from "./anonymous.conv";
import { ErrAlreadyExist } from "@errors/custom";

interface AccessTokenPayload {
    // 알아서 추가할 것
    name: string;
    etc: string;
}

export default class AnonymousService {
    private anonymousRepo: AnonymousRepo;

    constructor() {
        this.anonymousRepo = new AnonymousRepo();
    }

    signup = async (userDTO: dto.SignupReqDTO) => {
        const user = convSignupToUser(userDTO);

        try {
            // userID / email duplicate check
            if (
                (await this.anonymousRepo.findUserByUserID(user.userID)) ||
                (await this.anonymousRepo.findUserByEmail(user.email))
            ) {
                throw new Error(ErrAlreadyExist);
            }

            return await this.anonymousRepo.createUser(user);
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
