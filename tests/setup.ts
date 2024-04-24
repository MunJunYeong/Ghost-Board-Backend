////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mock - redis
import Ioredis from "ioredis-mock";
const redisMock = new Ioredis();
jest.mock("@configs/redis", () => {
    return {
        // RedisClient 클래스를 mocking합니다.
        getInstance: jest.fn(() => redisMock),
    };
});

// mock - crypto
export const mockEmailCode = "abc123";
jest.mock("@utils/crypto", () => ({
    createCode: jest.fn(() => {
        return mockEmailCode;
    }), // 원하는 값으로 설정
}));

// mock - logger
jest.mock("@configs/logger", () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));

// mock - email sender
jest.mock("@utils/mailer", () => ({
    sendIDMail: jest.fn(),
    sendPasswordMail: jest.fn(),
    sendSignUpMail: jest.fn(),
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// index.ts role
import Server from "@src/server";
import express from "express";

const app = express();
const server = new Server(app);
import Routes from "@src/routes";
import UserRepo from "@repo/user.repo";
import User from "@models/user";
import { hashing } from "@utils/lib/encryption";
const route = new Routes(app);
route.initialize();
server.start(3000);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const defaultID = "admin123";
export const defaultPwd = "admin456";
export const defaultUsername = "default123";
beforeAll(async () => {
    const userRepo = new UserRepo();
    if (!(await userRepo.getUserByUsername(defaultUsername))) {
        const pwd = await hashing(defaultPwd);
        const mail = await hashing("defaultEmail123@corelinesoft.com");
        userRepo.createUser(
            new User({
                id: defaultID,
                password: pwd,
                email: mail,
                username: defaultUsername,
                activate: true,
            })
        );
    }
});

// Jest가 모든 테스트 파일 실행 후에 서버를 종료하도록 설정
afterAll(async () => {
    await server.stop();
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

export default app;
