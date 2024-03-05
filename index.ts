import express, { Express } from "express";
import { GetEnvPath } from "./src/utils/path";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

import { initializeDB } from "./src/configs/database";
import { logger } from "./src/configs/logger";
import { morganMiddleware } from "./src/middlewares/morgan";
import router from "./src/routes";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

const start = async () => {
    try {
        const port = process.env.PORT || 3000;

        await initializeDB();

        // init router
        app.use(router);

        app.listen(port, () => {
            logger.info(`Server is running at https://localhost:${port}`);
        });
    } catch (err: any) {
        logger.error("cant initialize server : ", err.message);
    }
};

start(); // main 함수를 호출합니다.
