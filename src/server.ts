// env setting
import { GetEnvPath } from "@utils/path";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import "express-async-errors";

// swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import { morganMiddleware } from "@middlewares/morgan";
import { logger } from "@configs/logger";
import Database from "@configs/database";
import { apiLimiter } from "@utils/lib/rate-limit";

export default class Server {
    private app: Application;
    private server: any; // http.Server

    constructor(app: Application) {
        this.app = app;

        // init config
        this.initConfig();

        // init db
        this.initDatabase();
    }

    private initConfig = (): void => {
        const corsOptions: CorsOptions = {
            origin: "*",
        };

        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(apiLimiter);
        this.app.use(morganMiddleware);
        this.app.use(helmet());

        // swaager
        const swaggerSpec: any = YAML.load(path.join(__dirname, "./swagger.yaml"));
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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

    public start = (port: any): void => {
        this.server = this.app
            .listen(port, "0.0.0.0", () => {
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
