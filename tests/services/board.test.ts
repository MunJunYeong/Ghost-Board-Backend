import request from "supertest";
import app from "../setup";

import { CreateBoardReqDTO } from "@controllers/board/dto/board.dto";
import Board from "@models/board";
import { issueAccessToken } from "@utils/jwt";

let accessToken: string;
beforeEach(() => {
    accessToken = issueAccessToken({
        userId: 0,
        username: "test",
        id: "test123",
        email: "test123@test.com",
    });
});

let newBoard: Board;

const title = "title123";
const desc = "test title";

describe("Create Board API", () => {
    let body: CreateBoardReqDTO;
    beforeEach(() => {
        body = {
            title: title,
            description: desc,
        };
    });

    describe("성공", () => {
        test("Post - api/boards", async () => {
            const response: any = await request(app)
                .post("/api/boards")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(body);

            expect(response.statusCode).toBe(200);
            newBoard = response.body.data;
        });
    });
    describe("Exception", () => {
        test("invalid title - empty, length", async () => {
            async function testTitleLength(title: string, expectedStatusCode: number) {
                body.title = title;
                const response = await request(app)
                    .post("/api/boards")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(expectedStatusCode);
            }

            // empty title
            await testTitleLength("", 400);

            // short length 2
            await testTitleLength("aa", 400);

            // long length 16
            await testTitleLength("aaaaaaaaaaaaaaaa", 400);
        });
        test("empty description", async () => {
            async function testDescLength(desc: string, expectedStatusCode: number) {
                body.description = desc;
                const response = await request(app)
                    .post("/api/boards")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(expectedStatusCode);
            }

            // empty desc
            await testDescLength("", 400);

            // empty desc
            await testDescLength("aaaaaaaaaaaaaaaaaaaaaa", 400);
        });
        test("empty token", async () => {
            const response: any = await request(app).post("/api/boards").send(body);
            expect(response.statusCode).toBe(401);
        });
    });
});

describe("Get Board List API", () => {
    describe("성공", () => {
        test("Get - api/boards", async () => {
            const response: any = await request(app).get("/api/boards").set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("Get Board API", () => {
    describe("성공", () => {
        test("Get - api/boards/:id", async () => {
            const response: any = await request(app)
                .get(`/api/boards/${newBoard.boardId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);

            const result: Board = response.body.data;
            expect(result.title).toEqual(title);
            expect(result.description).toEqual(desc);
        });
    });
    describe("Exception", () => {
        test("not found", async () => {
            const response: any = await request(app)
                .get(`/api/boards/${newBoard.boardId + 100}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(404);
        });
    });
});

describe("Delete Board API", () => {
    describe("성공", () => {
        test("Delete - api/boards/:id", async () => {
            const response: any = await request(app)
                .delete(`/api/boards/${newBoard.boardId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Exception", () => {
        test("not found", async () => {
            const response: any = await request(app)
                .delete(`/api/boards/${newBoard.boardId + 100}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(404);
        });
    });
});
