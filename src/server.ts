// env setting
import { GetEnvPath } from "@utils/path";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import "express-async-errors";

import { morganMiddleware } from "@middlewares/morgan";
import Routes from "@routes/index";
import Database from "@configs/database";
import { logger } from "@configs/logger";

export default class Server {
    constructor(app: Application) {
        this.config(app);
        // init route
        new Routes(app);

        // init db
        this.initDB();
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

    private async initDB(): Promise<void> {
        try {
            const database = Database.getInstance();
            await database.initializeDB();
            logger.info("Database initialized successfully.");
        } catch (error) {
            logger.error("cant initializing database:", error);
        }
    }
}
