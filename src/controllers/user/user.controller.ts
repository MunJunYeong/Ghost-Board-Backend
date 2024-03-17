import { Request, Response } from "express";

// common
import { ErrNotFound } from "@errors/custom";
import BadRequestError from "@errors/bad_request";
import InternalError from "@errors/internal_server";
import RedisClient, { Redis } from "@configs/redis";

// server
import * as dto from "@controllers/user/dto/user.dto";
import UserService from "@services/user/user.service";
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
            const u: User = await this.userService.getUser(id);
            // delete user's password
            u.password = ""
            res.send({ message: `success get user (id : ${id})`, data: u.dataValues });
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
    updateUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body: dto.UpdateUserReqDTO = req.body;
        try {
            const u = await this.userService.updateUser(id, body);
            // delete user's password
            u.password = ""
            res.send({ message: `success get user (id : ${id})`, data: u.dataValues });
        } catch (err: any) {
            if (err.message === ErrNotFound) {
                throw new BadRequestError({ code: 404, error: err });
            }
            throw new InternalError({ error: err });
        }
    }
}
