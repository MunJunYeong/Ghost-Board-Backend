import { Request, Response } from "express";

import RedisClient, { Redis } from "@configs/redis";
import UserService from "@services/user/user.service";
import { ErrNotFound } from "@src/common/errors/custom";
import BadRequestError from "@src/common/errors/bad_request";
import InternalError from "@src/common/errors/internal_server";
import User from "@models/user";

export default class UserController {
    private redis: Redis;
    private userService: UserService;

    constructor() {
        this.redis = RedisClient.getInstance();

        this.userService = new UserService();
    }

    getUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const user: User = await this.userService.getUser(id);
            res.send({ message: `success get user (id : ${id})`, data: user.dataValues });
        } catch (err: any) {
            if (err.message === ErrNotFound) {
                throw new BadRequestError({ code: 404, error: err });
            }
            throw new InternalError({ error: err });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            await this.userService.deleteUser(id);
            res.send({ message: `success delete user (id : ${id})`, data: id });
        } catch (err: any) {
            if (err.message === ErrNotFound) {
                throw new BadRequestError({ code: 404, error: err });
            }
            throw new InternalError({ error: err });
        }
    };
}
