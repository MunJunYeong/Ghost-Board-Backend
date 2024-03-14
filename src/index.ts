import express, { Application } from "express";
import Server from "./server";

const app: Application = express();
const server: Server = new Server(app);

const port = process.env.PORT || 3000;
server.start(port);
