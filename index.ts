import express, { Express, Request, Response } from "express";
import cors from "cors";
import { GetEnvPath } from "./src/configs/common";
import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });
import { initializeDB } from "./src/configs/database";
import { logger } from "./src/configs/logger";

const app: Express = express();
app.use(cors());
app.use(express.json());

const start = async () => {
  try {
    const port = process.env.PORT || 3000;

    await initializeDB();

    app.get("/", (req: Request, res: Response) => {
      // business logic
      res.send("Express Server");
    });

    app.listen(port, () => {
      logger.info(`Server is running at https://localhost:${port}`);
    });
  } catch (err: any) {
    logger.error("cant initialize server : ", err.message);
  }
};

start(); // main 함수를 호출합니다.
