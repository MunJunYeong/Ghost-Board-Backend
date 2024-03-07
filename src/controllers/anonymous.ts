import { Request, Response } from "express";
import * as dto from "@dtos/anonymous";
import * as service from "@services/user";
import redis from "@configs/redis";

export default class AnonymousController {
    async login(req: Request, res: Response) {
        const loginBody: dto.LoginRequest = req.body;
        if (!loginBody.id || !loginBody.password) {
            // TODO: validation
        }

        try {
            const result: dto.LoginResponse = await service.login(loginBody.id, loginBody.password);

            redis.set(loginBody.id, result.refreshToken);

            res.status(200).send({
                data: result,
            });
        } catch (err) {
            // status code같은 경우에는 한 파일에서 define 하는 것도 좋음
            const unauthorized = 401;
            res.status(unauthorized).send({
                message: "invalid account",
            });
        }
    }
}
