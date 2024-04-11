import request from "supertest";
import app, { defaultID, defaultPwd } from "../setup";
import Board from "@models/board";
import { CreatePostReqDTO } from "@controllers/post/dto/post.dto";
import Post from "@models/post";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// precondition

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const postTitle = "test post title";
const postDesc = "test post content";

describe("Post API", () => {
    let endpoint: string;
    let accessToken: string;
    let board: Board;
    let newPost: Post;

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
            content: "test desc",
        };
        const boardRes: any = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(boardBody);
        board = boardRes.body.data;

        endpoint = `/api/boards/${board.boardId}/posts`;
    });

    afterAll(async () => {
        // delete board
        const res: any = await request(app)
            .delete(`/api/boards/${board.boardId}`)
            .set("Authorization", `Bearer ${accessToken}`);
    });

    describe("Create Post API", () => {
        let body: CreatePostReqDTO;
        beforeEach(() => {
            body = {
                title: postTitle,
                content: postDesc,
            };
        });

        describe("성공", () => {
            test("Post - api/boards/:boardId/posts", async () => {
                const response: any = await request(app)
                    .post(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);
                newPost = response.body.data;
            });
        });
        describe("Exception", () => {
            test("invalid title - empty, length", async () => {
                // empty title
                await testTitleLength("");
                // short length 2
                await testTitleLength("aaaa");
            });
            test("invalid content - empty, length", async () => {
                // empty title
                await testDescLength("");
                // short length 2
                await testDescLength("aaaaaaaaa");
            });
            test("invalid token", async () => {
                const response = await request(app).post(`${endpoint}`).send(body);
                expect(response.statusCode).toBe(401);
            });
            async function testTitleLength(title: string) {
                body.title = title;
                const response = await request(app)
                    .post(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(400);
            }

            async function testDescLength(desc: string) {
                body.content = desc;
                const response = await request(app)
                    .post(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);

                expect(response.statusCode).toBe(400);
            }
        });
    });

    describe("Get Post & Post list API", () => {
        describe("성공", () => {
            test("Get - api/boards/:boardId/posts", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);
            });
            test("Get - api/boards/:boardId/posts/:postId", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}/${newPost.postId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);
                const actualPost: Post = response.body.data;
                expect(actualPost.postId).toEqual(newPost.postId);
                expect(actualPost.title).toEqual(newPost.title);
                expect(actualPost.content).toEqual(newPost.content);
                expect(actualPost.createdAt).toEqual(newPost.createdAt);
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                let response: any = await request(app).get(`${endpoint}`);
                expect(response.statusCode).toBe(401);
                response = await request(app).get(`${endpoint}/${newPost.postId}`);
                expect(response.statusCode).toBe(401);
            });
            test("not found", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}/${newPost.postId + 100}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("Update Post API", () => {
        const sendUpdatePost = async (body: any) => {
            return await request(app)
                .put(`${endpoint}/${newPost.postId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(body);
        };
        describe("성공", () => {
            test("Put - api/boards/:boardId/posts/:postId", async () => {
                // check only changed title
                let changedTitle = "changed title";
                let res: any = await sendUpdatePost({ title: changedTitle });
                expect(res.statusCode).toBe(200);
                let actualPost: Post = res.body.data;
                expect(actualPost.title).toEqual(changedTitle);
                expect(actualPost.content).toEqual(newPost.content);

                // check only changed content
                let changedcontent = "changed content for test!";
                res = await sendUpdatePost({ content: changedcontent });
                expect(res.statusCode).toBe(200);
                actualPost = res.body.data;
                expect(actualPost.content).toEqual(changedcontent);
                expect(actualPost.title).toEqual(changedTitle);

                // changed both
                changedTitle = "last changed title";
                changedcontent = "last changed content";
                res = await sendUpdatePost({ title: changedTitle, content: changedcontent });
                expect(res.statusCode).toBe(200);
                actualPost = res.body.data;
                expect(actualPost.title).toEqual(changedTitle);
                expect(actualPost.content).toEqual(changedcontent);
                newPost = actualPost;
            });
        });
        describe("Exception", () => {
            test("invalid title", async () => {
                const response: any = await sendUpdatePost({ title: "1234" });
                expect(response.statusCode).toBe(400);
            });
            test("invalid content", async () => {
                const response: any = await sendUpdatePost({ content: "123456789" });
                expect(response.statusCode).toBe(400);
            });
            test("invalid token", async () => {
                let response: any = await request(app).put(`${endpoint}/${newPost.postId}`);
                expect(response.statusCode).toBe(401);
            });
        });
    });

    describe("Delete Post API", () => {
        describe("성공", () => {
            test("Delete - api/boards/:boardId/posts/:postId", async () => {
                const res: any = await request(app)
                    .delete(`${endpoint}/${newPost.postId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.statusCode).toBe(200);
            });
        });
        describe("Exception", () => {
            test("not found", async () => {
                const res: any = await request(app)
                    .delete(`${endpoint}/${newPost.postId + 100}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.statusCode).toBe(404);
            });
            test("invalid token", async () => {
                const res: any = await request(app).delete(`${endpoint}/${newPost.postId}`);
                expect(res.statusCode).toBe(401);
            });
        });
    });
});
