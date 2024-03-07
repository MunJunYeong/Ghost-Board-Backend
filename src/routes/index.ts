import { Application } from "express";
import anonymousRouter from "@routes/anonymous";
import userRouter from "@routes/user";

export default class Routes {
    constructor(app: Application) {
        app.use("/api/", anonymousRouter);
        app.use("/api/users", userRouter);
    }
}
