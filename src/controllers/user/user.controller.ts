import { Request, Response } from "express";

import RedisClient, { Redis } from "@src/configs/redis";
import UserService from "@src/services/user/user.service";
import { ErrNotFound } from "@src/common/errors/custom";
import BadRequestError from "@src/common/errors/bad_request";

export default class UserController {
    // private redis: Redis;
    private userService: UserService;

    constructor() {
        // const redisInstance = RedisClient.getInstance();
        // this.redis = redisInstance.getRedisInstance();
        
        this.userService = new UserService();
    }

    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            await this.userService.deleteUser(id);
            res.send({ message: `success delete user (id : ${id})`, data: id });
        } catch (err: any) {
            if (err.message === ErrNotFound) {
                throw new BadRequestError({ code: 404, error: err });
            }
        }
    };
}
