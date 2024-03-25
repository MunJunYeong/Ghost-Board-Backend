import { Request, Response } from "express";

// common
import { handleError } from "@errors/custom";
import RedisClient, { Redis } from "@configs/redis";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserService from "@services/user/user.service";
import { sendJSONResponse } from "@utils/response";

export default class UserController {
    private redis: Redis;
    private userService: UserService;

    constructor() {
        this.redis = RedisClient.getInstance();

        this.userService = new UserService();
    }

    getUser = async (req: Request, res: Response) => {
        const userID = req.params.id;

        try {
            const u = await this.userService.getUser(userID);
            sendJSONResponse(res, `success get user (id : ${userID})`, u)
        } catch (err: any) {
            throw handleError(err)
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        try {
            await this.userService.deleteUser(id);
            sendJSONResponse(res, `success delete user (id : ${id})`, true)
        } catch (err: any) {
            throw handleError(err)
        }
    };
    updateUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const body: dto.UpdateUserReqDTO = req.body;
        try {
            const u = await this.userService.updateUser(id, body);
            sendJSONResponse(res, `success get user (id : ${id})`, u)
        } catch (err: any) {
            throw handleError(err)
        }
    };
}
