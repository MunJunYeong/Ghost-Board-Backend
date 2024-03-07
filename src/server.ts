

import { GetEnvPath } from "@utils/path";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";

import { morganMiddleware } from "@middlewares/morgan";
import Routes from "@routes/index";

export default class Server {
    constructor(app: Application) {
        this.config(app);
        // init route
        new Routes(app);

        // init db
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "*",
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morganMiddleware);
    }
}
