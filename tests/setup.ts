import Server from "@src/server";
import express from "express";

jest.mock("redis", () => jest.requireActual("redis-mock"));

const app = express();
const server = new Server(app);
server.start(3000);

// Jest가 모든 테스트 파일 실행 후에 서버를 종료하도록 설정
afterAll(async () => {
    await server.stop();
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

export default app;
