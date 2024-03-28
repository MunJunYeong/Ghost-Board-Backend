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

describe("Post API", () => {
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
                // empty title
                await testTitleLength("");
                // short length 2
                await testTitleLength("aaaa");
            });
            test("invalid description - empty, length", async () => {
                // empty title
                await testDescLength("");
                // short length 2
                await testDescLength("aaaaaaaaa");
            });
            async function testTitleLength(title: string) {
                body.title = title;
                const response = await request(app)
                    .post(`/api/boards/${board.boardId}/posts`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(400);
            }

            async function testDescLength(desc: string) {
                body.description = desc;
                const response = await request(app)
                    .post(`/api/boards/${board.boardId}/posts`)
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
                    .get(`/api/boards/${board.boardId}/posts`)
                    .set("Authorization", `Bearer ${accessToken}`)
                expect(response.statusCode).toBe(200);
            });
            test("Get - api/boards/:boardId/posts/:postId", async () => {
                const response: any = await request(app)
                    .get(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                expect(response.statusCode).toBe(200);
                const actualPost: Post = response.body.data
                expect(actualPost.postId).toEqual(newPost.postId)
                expect(actualPost.title).toEqual(newPost.title)
                expect(actualPost.description).toEqual(newPost.description)
                expect(actualPost.createdAt).toEqual(newPost.createdAt)
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                let response: any = await request(app).get(`/api/boards/${board.boardId}/posts`)
                expect(response.statusCode).toBe(401);
                response = await request(app).get(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                expect(response.statusCode).toBe(401);
            });
            test("not found", async () => {
                const response: any = await request(app)
                    .get(`/api/boards/${board.boardId}/posts/${newPost.postId + 100}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("Update Post API", () => {
        const sendUpdatePost = async (body: any) => {
            return await request(app)
                .put(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(body);
        }
        describe("성공", () => {
            test("Put - api/boards/:boardId/posts/:postId", async () => {

                // check only changed title
                let changedTitle = "changed title"
                let res: any = await sendUpdatePost({ title: changedTitle })
                expect(res.statusCode).toBe(200);
                let actualPost: Post = res.body.data;
                expect(actualPost.title).toEqual(changedTitle)
                expect(actualPost.description).toEqual(newPost.description)

                // check only changed description
                let changedDescription = "changed description for test!"
                res = await sendUpdatePost({ description: changedDescription })
                expect(res.statusCode).toBe(200);
                actualPost = res.body.data;
                expect(actualPost.description).toEqual(changedDescription)
                expect(actualPost.title).toEqual(changedTitle)

                // changed both
                changedTitle = "last changed title"
                changedDescription = "last changed description"
                res = await sendUpdatePost({ title: changedTitle, description: changedDescription })
                expect(res.statusCode).toBe(200);
                actualPost = res.body.data;
                expect(actualPost.title).toEqual(changedTitle)
                expect(actualPost.description).toEqual(changedDescription)
                newPost = actualPost;
            });
        });
        describe("Exception", () => {
            test("invalid title", async () => {
                const response: any = await sendUpdatePost({ title: "1234" })
                expect(response.statusCode).toBe(400);

            });
            test("invalid description", async () => {
                const response: any = await sendUpdatePost({ description: "123456789" })
                expect(response.statusCode).toBe(400);
            });
            test("invalid token", async () => {
                let response: any = await request(app).put(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                expect(response.statusCode).toBe(401);
            });
        });
    });

    describe("Delete Post API", () => {
        describe("성공", () => {
            test("Delete - api/boards/:boardId/posts/:postId", async () => {
                const res: any = await request(app)
                    .delete(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                expect(res.statusCode).toBe(200);
            });
        });
        describe("Exception", () => {
            test("not found", async () => {
                const res: any = await request(app)
                    .delete(`/api/boards/${board.boardId}/posts/${newPost.postId + 100}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                expect(res.statusCode).toBe(404);

            });
            test("invalid token", async () => {
                const res: any = await request(app)
                    .delete(`/api/boards/${board.boardId}/posts/${newPost.postId}`)
                expect(res.statusCode).toBe(401);
            });
        });
    });
})
