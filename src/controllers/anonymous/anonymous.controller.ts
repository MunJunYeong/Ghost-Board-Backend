import { Request, Response } from "express";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import * as service from "@services/user.service";
import redis from "@configs/redis";
import AnonymousService from "@services/anonymous.service";

export default class AnonymousController {
    private anonymouseService: AnonymousService;

    constructor() {
        this.anonymouseService = new AnonymousService(); // UserService 인스턴스를 생성합니다.
    }

    async signup(req: Request, res: Response) {
        const body: dto.SignupReqDTO = req.body;

        this.anonymouseService.signup(body);

        try {
        } catch (error) {}
    }

    async login(req: Request, res: Response) {
        const loginBody: dto.LoginReqDTO = req.body;

        try {
            const result: dto.LoginResDTO = await service.login(loginBody.id, loginBody.password);

            redis.set(loginBody.id, result.refreshToken);

            res.status(200).send({
                data: result,
            });
        } catch (error) {
            // status code같은 경우에는 한 파일에서 define 하는 것도 좋음
            const unauthorized = 401;
            res.status(unauthorized).send({
                message: "invalid account",
            });
        }
    }
}
