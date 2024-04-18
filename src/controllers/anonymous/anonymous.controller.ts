import { Request, Response } from "express";
import crypto from "crypto";

import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import RedisClient, { Redis } from "@configs/redis";
import AnonymousService from "@services/anonymous/anonymous.service";
import InternalError from "@errors/internal_server";
import BadRequestError from "@errors/bad_request";
import {
    ErrAlreadyExist,
    ErrInvalidArgument,
    ErrNotFound,
    ErrTooManyRequest,
    ErrUnauthorized,
    handleError,
} from "@errors/handler";
import { issueAccessToken, verifyAccessToken, verifyRefreshToken } from "@utils/jwt";
import { sendJSONResponse } from "@utils/response";
import { sendIDMail, sendPasswordMail, sendSignUpMail } from "@utils/mailer";

export default class AnonymousController {
    private redis: Redis;
    private anonymouseService: AnonymousService;
    private canSignUp = "true";

    constructor() {
        this.redis = RedisClient.getInstance();

        this.anonymouseService = new AnonymousService();
    }

    private createCode = () => {
        return crypto.randomBytes(3).toString("hex");
    };

    private combinedSignup = (email: string) => {
        const prefix = "signup_";
        return prefix.concat(email);
    };

    private combinedPassword = (email: string) => {
        const prefix = "password_";
        return prefix.concat(email);
    };

    private isCorelineDomain = (email: string) => {
        const prefix = email.split("@")[1];
        if ("corelinesoft.com" !== prefix && "corelinesoft.co.kr" !== prefix) {
            return false;
        }
        return true;
    };

    // 회원가입
    signup = async (req: Request, res: Response) => {
        const body: dto.SignupReqDTO = req.body;
        try {
            // domain 확인
            if (!this.isCorelineDomain(body.email)) {
                throw ErrInvalidArgument;
            }
            // email 인증이 된 올바른 request인지 확인
            const isValidEmail = await this.redis.get(this.combinedSignup(body.email));
            if (isValidEmail != this.canSignUp) {
                throw ErrUnauthorized;
            }

            const u = await this.anonymouseService.signup(body);

            // delete email in redis
            await this.redis.del(this.combinedSignup(body.email));

            sendJSONResponse(res, "success signup", u);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // 로그인
    login = async (req: Request, res: Response) => {
        const loginBody: dto.LoginReqDTO = req.body;

        try {
            const result = await this.anonymouseService.login(loginBody);

            // 유효기간 : 14일 - jwt.ts 파일의 refresh token `expiresIn` 값과 일치해야 함.
            this.redis.set(loginBody.id, result.refreshToken, "EX", 14 * 24 * 60 * 60);

            sendJSONResponse(res, "success login", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // 이메일 전송 - only controller layer
    sendEmailForSignup = async (req: Request, res: Response) => {
        const { email }: dto.EmailReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            // 5분에 한 번만 전송이 가능
            if (await this.redis.get(this.combinedSignup(email))) {
                throw ErrTooManyRequest;
            }

            // 이미 회원가입된 ID인지 확인이 필요
            if (await this.anonymouseService.findUserByEmail(email)) {
                throw ErrAlreadyExist;
            }

            // 인증 코드 생성
            const code = this.createCode();
            await sendSignUpMail(email, code);

            // save email in redis - 유효기간 5분
            this.redis.set(this.combinedSignup(email), code, "EX", 300);

            sendJSONResponse(res, "success send email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    checkEmailForSignup = async (req: Request, res: Response) => {
        const { email, code }: dto.CheckEmailReqDTO = req.body;

        try {
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            const savedCode = await this.redis.get(this.combinedSignup(email));
            if (savedCode !== code) {
                throw ErrNotFound;
            }

            // update email in redis - 유효기간 30분
            this.redis.set(this.combinedSignup(email), this.canSignUp, "EX", 1800);
            sendJSONResponse(res, "success check email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // 사용자의 Email로 회원가입한 복수의 로그인 정보
    findMaskingUser = async (req: Request, res: Response) => {
        const { email }: dto.EmailReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            const result = await this.anonymouseService.findUserByEmail(email);
            if (!result) {
                throw ErrNotFound;
            }
            result.id = maskLastThreeCharacters(result.id);
            sendJSONResponse(res, "success find user account list", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    /*
    특정 사용자 ID를 이메일 전송
    404 error - wrong username
    401 error - wrong email (correct username)
    */
    sendExactUserID = async (req: Request, res: Response) => {
        const { email, username }: dto.SendIDReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            const user = await this.anonymouseService.findUserByEmailUsername(email, username);
            await sendIDMail(email, user.id);

            sendJSONResponse(res, "success send email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    changePassword = async (req: Request, res: Response) => {
        const { username, email, password }: dto.ChangePasswordReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            // email 인증이 된 올바른 request인지 확인
            const isValidEmail = await this.redis.get(this.combinedPassword(email));
            if (isValidEmail != this.canSignUp) {
                throw ErrUnauthorized;
            }

            // update password
            await this.anonymouseService.changePassword(username, password);

            // delete email in redis
            await this.redis.del(this.combinedPassword(email));
            sendJSONResponse(res, "success change password", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // 비밀번호 재설정을 위한 이메일 전송
    sendEmailForPassword = async (req: Request, res: Response) => {
        const { email }: dto.EmailReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }
            // 5분에 한 번만 전송이 가능
            if (await this.redis.get(this.combinedPassword(email))) {
                throw ErrTooManyRequest;
            }

            const code = this.createCode();
            await sendPasswordMail(email, code);

            // save email in redis - 유효기간 5분
            this.redis.set(this.combinedPassword(email), code, "EX", 300);

            sendJSONResponse(res, "success send email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    checkEmailForPassword = async (req: Request, res: Response) => {
        const { email, code }: dto.CheckEmailReqDTO = req.body;

        try {
            // domain 확인
            if (!this.isCorelineDomain(email)) {
                throw ErrInvalidArgument;
            }

            const savedCode = await this.redis.get(this.combinedPassword(email));
            if (savedCode !== code) {
                throw ErrNotFound;
            }

            // update email in redis - 유효기간 30분
            this.redis.set(this.combinedPassword(email), this.canSignUp, "EX", 1800);
            sendJSONResponse(res, "success check email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // refresh token 발급 - only controller layer
    refresh = async (req: Request, res: Response) => {
        // repo에 접근할 경우가 아니기에 Service layer에 로직을 담지 않음.
        try {
            if (!req.headers.authorization || !req.headers.refresh) {
            }
            const accessToken = req.headers.authorization!.split("Bearer ")[1];
            const refreshToken = req.headers.refresh as string;

            const decoded = verifyAccessToken(accessToken);
            // exception
            {
                // valid한 accessToken의 경우에는 해당 API를 호출해서는 아니된다.
                if (decoded.valid) {
                    throw new BadRequestError({ message: "is valid accesstoken" });
                }
                // accessToken이 Expired된 토큰이 아닌 경우의 exception (malformed와 같은 오류일 수 있다.)
                if (decoded.error.name !== "TokenExpiredError") {
                    throw new BadRequestError({ error: decoded.error });
                }
                if (!decoded.user?.userId) {
                    throw new BadRequestError({ message: "not exist user data in decoded token" });
                }
            }

            // userID로 redis에 저장된 refresh token이 맞는지 확인 후 verify까지 함수에서 책임지고 함
            if (!(await verifyRefreshToken(refreshToken, decoded.user?.id))) {
                throw new InternalError();
            }

            const newPayload = {
                userId: decoded.user.userId,
                id: decoded.user.id,
                username: decoded.user.username,
                email: decoded.user.email,
            };
            const newToken = issueAccessToken(newPayload);
            sendJSONResponse(res, "success refresh accessToken", { accessToken: newToken });
        } catch (err: any) {
            throw handleError(err);
        }
    };
}

function maskLastThreeCharacters(input: string): string {
    if (input.length <= 3) {
        return input.replace(/./g, "*"); // 문자열 전체를 '*'로 대체
    }

    const visiblePart = input.substring(0, input.length - 3); // 마지막 3개를 제외한 문자열
    const maskedPart = input.substring(input.length - 3).replace(/./g, "*"); // 마지막 3개를 '*'로 대체

    return visiblePart + maskedPart;
}
