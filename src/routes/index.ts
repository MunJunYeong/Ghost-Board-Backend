import { Application } from "express";

import anonymousRouter from "@routes/anonymous.routes";
import userRouter from "@routes/user.routes";
import boardRoute from "@routes/board.route";

import { errorMiddleware } from "@middlewares/error";
import { authMiddleware } from "@middlewares/auth";

export default class Routes {
    private app: Application | null;

    constructor(app: Application) {
        this.app = app;
    }

    public initialize = () => {
        if (!this.app) {
            throw new Error("Cant initialize routes");
        }
        this.app.use("/api/", anonymousRouter);
        this.app.use("/api/users", authMiddleware, userRouter);

        // user의 경우에는 token과 
        this.app.use("/api/boards", authMiddleware, boardRoute);

        // error middleware가 가장 마지막에 있어야 함.
        this.app.use(errorMiddleware);
    };
}
