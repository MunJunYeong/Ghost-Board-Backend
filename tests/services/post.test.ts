import request from "supertest";
import app, { defaultID, defaultPwd } from "../setup";
import Board from "@models/board";
import { CreatePostReqDTO } from "@controllers/post/dto/post.dto";
import Post from "@models/post";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// precondition

let accessToken: string;
let board: Board;
beforeAll(async () => {
    const loginBody = {
        id: defaultID,
        password: defaultPwd,
    };
    const loginRes: any = await request(app).post(`/api/login`).send(loginBody);
    accessToken = loginRes.body.data.accessToken;

    // board
    const boardBody = {
        title: "test",
        description: "test desc",
    };
    const boardRes: any = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(boardBody);
    board = boardRes.body.data;
});

afterAll(async () => {
    // delete board
    const res: any = await request(app)
        .delete(`/api/boards/${board.boardId}`)
        .set("Authorization", `Bearer ${accessToken}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const postTitle = "test post title";
const postDesc = "test post description";
let newPost: Post;

describe("Create Post API", () => {
    let body: CreatePostReqDTO;
    beforeEach(() => {
        body = {
            title: postTitle,
            description: postDesc,
        };
    });

    describe("성공", () => {
        test("Post - api/boards/:boardId/posts", async () => {
            const response: any = await request(app)
                .post(`/api/boards/${board.boardId}/posts`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(body);
            expect(response.statusCode).toBe(200);
            newPost = response.body.data;
        });
    });
    describe("Exception", () => {
        test("invalid title - empty, length", async () => {
            async function testTitleLength(title: string, expectedStatusCode: number) {
                body.title = title;
                const response = await request(app)
                    .post(`/api/boards/${board.boardId}/posts`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(expectedStatusCode);
            }

            // empty title
            await testTitleLength("", 400);

            // short length 2
            await testTitleLength("aaaa", 400);
        });
        test("invalid description - empty, length", async () => {
            async function testDescLength(desc: string, expectedStatusCode: number) {
                body.description = desc;
                const response = await request(app)
                    .post(`/api/boards/${board.boardId}/posts`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(expectedStatusCode);
            }

            // empty title
            await testDescLength("", 400);

            // short length 2
            await testDescLength("aaaaaaaaa", 400);
        });
    });
});
