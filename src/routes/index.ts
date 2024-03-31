import { Application } from "express";

import anonymousRouter from "@routes/anonymous.routes";
import userRouter from "@routes/user.routes";
import boardRoute from "@routes/board.route";
import postRoute from "@routes/post.route";

import { errorMiddleware } from "@middlewares/error";
import { authMiddleware } from "@middlewares/auth";
import commentRoute from "./comment.route";

export default class Routes {
    private app: Application | null;

    constructor(app: Application) {
        this.app = app;
    }

    public initialize = () => {
        if (!this.app) {
            throw new Error("Cant initialize routes");
        }
        this.app.use("/api", anonymousRouter);
        this.app.use("/api", authMiddleware, userRouter);
        this.app.use("/api", authMiddleware, boardRoute);
        this.app.use("/api", authMiddleware, postRoute);
        this.app.use("/api", authMiddleware, commentRoute);

        // error middleware가 가장 마지막에 있어야 함.
        this.app.use(errorMiddleware);
    };
}
