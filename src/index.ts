import express, { Application } from "express";
import Server from "./server";
import { logger } from "@configs/logger";

const app: Application = express();
const server: Server = new Server(app);
const port = process.env.PORT || 3000;

app.listen(port, function () {
    logger.info(`Server is running on port ${port}.`);
}).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        logger.error("Error: address already in use");
    } else {
        logger.error(err.message);
    }
});
