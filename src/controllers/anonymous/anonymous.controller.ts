import { Request, Response } from "express";

import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import RedisClient, { Redis } from "@configs/redis";
import AnonymousService from "@services/anonymous/anonymous.service";
import InternalError from "@errors/internal_server";
import BadRequestError from "@errors/bad_request";
import { ErrAlreadyExist, ErrNotFound } from "@errors/custom";
import { issueAccessToken, verifyAccessToken, verifyRefreshToken } from "@utils/jwt";

export default class AnonymousController {
    private redis: Redis;
    private anonymouseService: AnonymousService;

    constructor() {
        this.redis = RedisClient.getInstance();

        this.anonymouseService = new AnonymousService();
    }

    signup = async (req: Request, res: Response) => {
        const body: dto.SignupReqDTO = req.body;
        try {
            const u = await this.anonymouseService.signup(body);

            if (!u) {
                throw new InternalError({ error: new Error("cant find user but created") });
            }

            res.send({ message: "success created user", data: u });
        } catch (err: any) {
            if (err.message === ErrAlreadyExist) {
                throw new BadRequestError({ error: err });
            }
            throw new InternalError({ error: err });
        }
    };

    login = async (req: Request, res: Response) => {
        const loginBody: dto.LoginReqDTO = req.body;

        try {
            const result = await this.anonymouseService.login(loginBody);

            this.redis.set(loginBody.userID, result.refreshToken);

            res.status(200).send({ data: result });
        } catch (err: any) {
            if (err.message === ErrNotFound) {
                throw new BadRequestError({ code: 404, error: err });
            }
            throw new InternalError({ error: err });
        }
    };

    // repo에 접근할 경우가 아니기에 Service layer에 로직을 담지 않음.
    refresh = async (req: Request, res: Response) => {
        try {
            if (!req.headers.authorization || !req.headers.refresh) {
            }
            const accessToken = req.headers.authorization!.split("Bearer ")[1];
            const refreshToken = req.headers.refresh as string;

            const decoded = verifyAccessToken(accessToken);
            console.log(decoded)
            // exception
            {
                // valid한 accessToken의 경우에는 해당 API를 호출해서는 아니된다.
                if (decoded.valid) {
                    throw new BadRequestError({error: new Error("is valid accesstoken")});
                }
                // accessToken이 Expired된 토큰이 아닌 경우의 exception (malformed와 같은 오류일 수 있다.)
                if (decoded.error.name !== "TokenExpiredError") {
                    throw new BadRequestError({ error: decoded.error });
                }
                if (!decoded.user?.userID) {
                    throw new BadRequestError({ error: new Error("not exist user data in decoded token") });
                }
            }

            // userID로 redis에 저장된 refresh token이 맞는지 확인 후 verify까지 함수에서 책임지고 함
            if (!(await verifyRefreshToken(refreshToken, decoded.user?.userID))) {
                throw new InternalError();
            }

            const newPayload = {
                id: decoded.user.id,
                userID: decoded.user.userID,
                username: decoded.user.username,
                email: decoded.user.email,
            };
            const newToken = issueAccessToken(newPayload);
            res.status(200).send({ data: { accessToken: newToken } });
        } catch (err: any) {
            throw new InternalError({ error: err });
        }
    };
}
