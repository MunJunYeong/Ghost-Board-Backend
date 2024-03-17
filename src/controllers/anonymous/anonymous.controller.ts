import { Request, Response } from "express";

import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import RedisClient, { Redis } from "@configs/redis";
import AnonymousService from "@services/anonymous/anonymous.service";
import InternalError from "@errors/internal_server";
import BadRequestError from "@errors/bad_request";
import { ErrAlreadyExist } from "@errors/custom";

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
            // delete user's password
            u.password = ""

            res.send({ message: "success created user", data: u.dataValues });
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
            const result: dto.LoginResDTO = await this.anonymouseService.login(loginBody.id, loginBody.password);

            this.redis.set(loginBody.id, result.refreshToken);

            res.status(200).send({
                data: result,
            });
        } catch (error: any) {
            // status code같은 경우에는 한 파일에서 define 하는 것도 좋음
            throw new InternalError(error);
        }
    };
}
