import { Request, Response } from "express";
import crypto from "crypto";

import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import RedisClient, { Redis } from "@configs/redis";
import AnonymousService from "@services/anonymous/anonymous.service";
import InternalError from "@errors/internal_server";
import BadRequestError from "@errors/bad_request";
import { ErrNotFound, handleError } from "@errors/handler";
import { issueAccessToken, verifyAccessToken, verifyRefreshToken } from "@utils/jwt";
import { sendJSONResponse } from "@utils/response";
import { sendMail } from "@utils/mailer";

export default class AnonymousController {
    private redis: Redis;
    private anonymouseService: AnonymousService;

    constructor() {
        this.redis = RedisClient.getInstance();

        this.anonymouseService = new AnonymousService();
    }

    // 회원가입
    signup = async (req: Request, res: Response) => {
        const body: dto.SignupReqDTO = req.body;
        try {
            const u = await this.anonymouseService.signup(body);

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
            this.redis.set(loginBody.id, result.refreshToken, 'EX', 14 * 24 * 60 * 60);

            sendJSONResponse(res, "success login", result);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    // 이메일 전송 - only controller layer
    sendEmail = async (req: Request, res: Response) => {
        const emailBody: dto.EmailReqDTO = req.body;

        try {
            const code = crypto.randomBytes(3).toString('hex');

            await sendMail(emailBody.email, code);

            // 유효기간 5분
            this.redis.set(emailBody.email, code, "EX", 300);

            sendJSONResponse(res, "success send email", true);
        } catch (err: any) {
            throw handleError(err);
        }
    };

    checkEmail = async (req: Request, res: Response) => {
        const emailBody: dto.CheckEmailReqDTO = req.body;

        try {
            const savedCode = await this.redis.get(emailBody.email);
            if (savedCode !== emailBody.code) {
                throw ErrNotFound;
            }

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
