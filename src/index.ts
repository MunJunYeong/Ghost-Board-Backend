import express, { Application } from "express";
import Server from "./server";

const port = process.env.PORT || 3000;

const app: Application = express();

// create server instance
const server: Server = new Server(app);

// TODO: typescript import 시점 init constructor 오류 확인
// server instance 생성 -> route instance 생성
// 그러나 import하는 line을 3으로 옮기게 된다면 server instance보다 route가 먼저 생성되는 문제점이 있음.
import Routes from "./routes";
const route = new Routes(app);
route.initialize();

server.start(port);
