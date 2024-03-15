import { Application } from "express";
import anonymousRouter from "@routes/anonymous.routes";
import userRouter from "@routes/user.routes";
import { errorMiddleware } from "@middlewares/error";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/", anonymousRouter);
        app.use("/api/users", userRouter);

        // error middleware가 가장 마지막에 있어야 함.
        app.use(errorMiddleware);
    }
}
