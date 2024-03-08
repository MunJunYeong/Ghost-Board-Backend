import { Application } from "express";
import anonymousRouter from "@routes/anonymous.routes";
import userRouter from "@routes/user.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/", anonymousRouter);
        app.use("/api/users", userRouter);
    }
}
