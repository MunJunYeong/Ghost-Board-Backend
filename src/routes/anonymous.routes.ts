import { Request, Response, Router } from "express";

import anonymousController from "@controllers/anonymous/anonymous.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/anonymous/dto/anonymous.dto";
import { sendMail } from "@utils/mailer";

class AnonymousRoutes {
    router = Router();
    controller = new anonymousController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/signup", validationMiddleware(dto.SignupReqDTO), this.controller.signup);

        this.router.post("/login", validationMiddleware(dto.LoginReqDTO), this.controller.login);

        this.router.post("/refresh", this.controller.refresh);

        this.router.post("/test", async (req: Request, res: Response) => {
            const result = await sendMail("msw711666@naver.com")
            res.status(200).json({
                status: 'Success',
                code: 200,
                message: 'Sent Auth Email',
                data: result
            });
        });
    }
}

export default new AnonymousRoutes().router;
