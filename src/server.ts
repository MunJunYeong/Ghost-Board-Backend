// env setting
import { GetEnvPath } from "@utils/path";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import "express-async-errors";

import { morganMiddleware } from "@middlewares/morgan";
import { logger } from "@configs/logger";
import Database from "@configs/database";
import Routes from "@routes/index";

export default class Server {
    private app: Application;
    private server: any; // http.Server

    constructor(app: Application) {
        this.app = app;

        // init config
        this.initConfig();

        // init db
        this.initDatabase();

        // init route
        this.initRoutes();
    }

    private initConfig = (): void => {
        const corsOptions: CorsOptions = {
            origin: "*",
        };

        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morganMiddleware);
        this.app.use(helmet());
    };

    private initDatabase = async (): Promise<void> => {
        try {
            const database = Database.getInstance();
            await database.initializeDB();
            logger.info("Database initialized successfully.");
        } catch (error) {
            logger.error("cant initializing database:", error);
        }
    };

    private initRoutes = (): void => {
        const route = new Routes(this.app);
        route.initialize();
    };

    public start = (port: any): void => {
        this.server = this.app
            .listen(port, () => {
                logger.info(`Server is running on port ${port}.`);
            })
            .on("error", (err: any) => {
                if (err.code === "EADDRINUSE") {
                    logger.error("Error: address already in use");
                } else {
                    logger.error(err.message);
                }
            });
    };

    public stop = async (): Promise<void> => {
        this.server.close();
        logger.info("Server stopped.");
    };
}
