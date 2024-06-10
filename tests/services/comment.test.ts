import request from "supertest";
import app, { defaultID, defaultPwd } from "../setup";

import Board from "@models/board";
import Post from "@models/post/post";
import Comment from "@models/comment/comment";
import { CreateCommentReqDTO } from "@controllers/comment/dto/comment.dto";
import { TestDELETE, TestGET, TestPOST, TestPUT } from "../common";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// precondition

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let newComment: Comment;

describe("Comment API", () => {
    let accessToken: string;
    let board: Board;
    let post: Post;
    let endpoint: string;
    const fixedContent = "test content";

    beforeAll(async () => {
        // get accessToken
        const loginBody = {
            id: defaultID,
            password: defaultPwd,
        };
        const loginRes: any = await request(app).post(`/api/login`).send(loginBody);
        accessToken = loginRes.body.data.accessToken;

        // create Board
        const boardBody = {
            title: "test",
            description: "test desc",
        };
        const boardRes: any = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(boardBody);
        board = boardRes.body.data;

        // create Post
        const postBody = {
            title: "test post",
            content: "test post desc",
        };
        const postRes: any = await request(app)
            .post(`/api/boards/${board.boardId}/posts`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(postBody);
        post = postRes.body.data;

        endpoint = `/api/boards/${board.boardId}/posts/${post.postId}/comments`;
    });

    afterAll(async () => {
        const deletePostRes: any = await request(app)
            .delete(`/api/boards/${board.boardId}/posts/${post.postId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // delete board
        const res: any = await request(app)
            .delete(`/api/boards/${board.boardId}`)
            .set("Authorization", `Bearer ${accessToken}`);
    });

    describe("Create Comment API", () => {
        let body: CreateCommentReqDTO;
        beforeEach(() => {
            body = {
                content: fixedContent,
                parentCommentId: null,
                isAnonymous: true,
            };
        });

        describe("성공", () => {
            test("Post - api/boards/:boardId/posts/:postId/comments", async () => {
                const response: any = await request(app)
                    .post(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);
                newComment = response.body.data;
            });
        });
        describe("Exception", () => {
            test("invalid content", async () => {
                body.content = "";
                await TestPOST(endpoint, body, 400, accessToken);
            });
            test("invalid token", async () => {
                await TestPOST(endpoint, body, 401, "");
            });
        });
    });

    describe("Get Comment API", () => {
        let body: CreateCommentReqDTO;
        beforeEach(() => {
            body = {
                content: "test comment",
                parentCommentId: null,
                isAnonymous: true,
            };
        });

        describe("성공", () => {
            test("Get - api/boards/:boardId/posts/:postId/comments", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);
                const result: Comment[] = response.body.data;
                expect(result[0].content).toEqual(fixedContent);
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                await TestGET(endpoint, 401);
            });
        });
    });

    describe("Update Comment API", () => {
        let body: CreateCommentReqDTO;
        const changedContent = "changed comment";
        beforeEach(() => {
            body = {
                content: changedContent,
                parentCommentId: null,
                isAnonymous: true,
            };
        });

        describe("성공", () => {
            test("Update - api/boards/:boardId/posts/:postId/comments/:commentId", async () => {
                const response: any = await request(app)
                    .put(`${endpoint}/${newComment.commentId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);
                const result = response.body.data;
                expect(result.content).toEqual(changedContent);

                // get API를 통해서 확인
                const getRes: any = await request(app).get(`${endpoint}`).set("Authorization", `Bearer ${accessToken}`);
                expect(getRes.statusCode).toBe(200);
                const getResult: Comment[] = getRes.body.data;
                expect(getResult[0].content).toEqual(changedContent);
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                await TestPUT(endpoint, body, 401);
            });
        });
    });

    describe("Comment Like API", () => {
        let likeEndpoint: string;
        beforeAll(async () => {
            likeEndpoint = `${endpoint}/${newComment.commentId}/like`;
        });
        describe("Create comment_like API", () => {
            describe("성공", () => {
                test("Post - api/boards/:boardId/posts/:postId/comments/:commentId/like", async () => {
                    await TestPOST(likeEndpoint, "", 200, accessToken);
                });
            });
            describe("Exception", () => {
                test("already exist", async () => {
                    await TestPOST(likeEndpoint, "", 400, accessToken);
                });
                test("invalid token", async () => {
                    await TestPOST(likeEndpoint, "", 401, "");
                });
            });
        });
        describe("Get comment_like API", () => {
            describe("성공", () => {
                test("Get - api/boards/:boardId/posts/:postId/comments/:commentId/like", async () => {
                    await TestGET(likeEndpoint, 200, accessToken);
                });
            });
            describe("Exception", () => {
                test("invalid token", async () => {
                    await TestGET(likeEndpoint, 401, "");
                });
            });
        });
        describe("Delete comment_like API", () => {
            describe("성공", () => {
                test("Delete - api/boards/:boardId/posts/:postId/comments/:commentId/like", async () => {
                    await TestDELETE(likeEndpoint, 200, accessToken);
                });
            });
            describe("Exception", () => {
                test("invalid token", async () => {
                    await TestDELETE(likeEndpoint, 401, "");
                });
            });
        });
    });

    describe("Delete Comment API", () => {
        describe("성공", () => {
            test("Delete - api/boards/:boardId/posts/:postId/comments/:commentId", async () => {
                await TestDELETE(`${endpoint}/${newComment.commentId}`, 200, accessToken);
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                await TestDELETE(`${endpoint}/${newComment.commentId}`, 401);
            });
        });
    });
});
