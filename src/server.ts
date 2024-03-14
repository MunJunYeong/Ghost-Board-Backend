// env setting
import { GetEnvPath } from "@utils/path";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import "express-async-errors";

import { morganMiddleware } from "@middlewares/morgan";
import Routes from "@routes/index";
import Database from "@configs/database";
import { logger } from "@configs/logger";

export default class Server {
    private app: Application;
    private server: any; // http.Server

    constructor(app: Application) {
        this.app = app;

        // init config
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
        app.use(helmet());
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

    public start(port: any): void {
        this.server = this.app
            .listen(port, function () {
                logger.info(`Server is running on port ${port}.`);
            })
            .on("error", (err: any) => {
                if (err.code === "EADDRINUSE") {
                    logger.error("Error: address already in use");
                } else {
                    logger.error(err.message);
                }
            });
    }

    public async stop(): Promise<void> {
        this.server.close();

        logger.info("Server stopped.");
    }
}
