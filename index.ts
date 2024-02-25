import express, { Express, Request, Response } from "express";
import { GetEnvPath } from "./src/configs/common";

import * as dotenv from "dotenv";
dotenv.config({ path: GetEnvPath() });

const app: Express = express();
const port = process.env.PORT || 3000;
// console.log("path :", envPath);

app.get("/", (req: Request, res: Response) => {
    // business logic

    res.send("Express Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
});
