import { SignupReqDTO } from "@controllers/anonymous/dto/anonymous.dto";
import AnonymousRepo from "@repo/anonymous.repo";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";

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

    test = async () => {
        // unique한지 확인 과정
        return true;
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
