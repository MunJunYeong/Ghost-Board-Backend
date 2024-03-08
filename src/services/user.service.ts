import { LoginResDTO } from "@controllers/anonymous/dto/anonymous.dto";
import { issueAccessToken, issueRefreshToken } from "@utils/jwt";

interface AccessTokenPayload {
    // 알아서 추가할 것
    name: string;
    etc: string;
}

export const login = async (userID: string, pw: string): Promise<LoginResDTO> => {
    //  user login 로직 - DB에 접근하여 id pw 대조
    // 아래는 예시용 payload. 실제로는 user 정보를 넣어야 함.
    const tempPayload: AccessTokenPayload = { name: "aa", etc: "bb" };
    // 성공 했다면 토큰 발행

    return {
        accessToken: issueAccessToken(tempPayload, "1h" /* 이것도 예시임 */),
        refreshToken: issueRefreshToken(),
    };
};
