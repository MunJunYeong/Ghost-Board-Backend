import request from "supertest";
import app, { defaultID, defaultPwd, usualID, usualPwd } from "../setup";
import Board from "@models/board";
import Post from "@models/post/post";

import { CreatePostReqDTO } from "@controllers/post/dto/post.dto";
import { CreateBoard, DeleteBoard, GetAccessToken, TestDELETE, TestGET, TestPOST, TestPUT } from "../common";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const postTitle = "test post title";
const postDesc = "test post content";

describe("Post API", () => {
    let endpoint: string;
    let accessToken: string;
    let board: Board;
    let newPost: Post;

    beforeAll(async () => {
        // set access_token
        accessToken = await GetAccessToken();

        // board
        board = await CreateBoard(accessToken);

        endpoint = `/api/boards/${board.boardId}/posts`;
    });

    afterAll(async () => {
        // delete board
        await DeleteBoard(accessToken, board.boardId);
    });

    describe("Create Post API", () => {
        let body: CreatePostReqDTO;
        beforeEach(() => {
            body = {
                title: postTitle,
                content: postDesc,
                isAnonymous: true,
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
                await TestPOST(endpoint, body, 400, accessToken);
            }

            async function testDescLength(desc: string) {
                body.content = desc;
                await TestPOST(endpoint, body, 400, accessToken);
            }
        });
    });

    describe("Get Post & Post list API", () => {
        describe("성공", () => {
            test("Get - api/boards/:boardId/posts", async () => {
                await TestGET(endpoint, 200, accessToken);
            });
            test("Get - api/boards/:boardId/posts/:postId", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}/${newPost.postId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);
            });
        });
        describe("Exception", () => {
            test("invalid token", async () => {
                await TestGET(endpoint, 401);
                await TestGET(`${endpoint}/${newPost.postId}`, 401);
            });
            test("not found", async () => {
                await TestGET(`${endpoint}/${newPost.postId + 100}`, 404, accessToken);
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
                await TestPUT(`${endpoint}/${newPost.postId}`, { title: "1234" }, 400, accessToken);
            });
            test("invalid content", async () => {
                await TestPUT(`${endpoint}/${newPost.postId}`, { content: "123456789" }, 400, accessToken);
            });
            test("invalid token", async () => {
                await TestPUT(`${endpoint}/${newPost.postId}`, { content: "123456789" }, 401);
            });
        });
    });

    // only for admin user
    describe("Get deactivate post list", () => {
        beforeAll(async () => {});
        describe("성공", () => {
            test("Get - api/boards/:boardId/posts/report", async () => {
                await TestGET(`${endpoint}/report`, 200, accessToken);
            });
        });
        describe("Exception", () => {
            test("Not admin access", async () => {
                const loginBody = { id: usualID, password: usualPwd };
                const loginRes: any = await request(app).post(`/api/login`).send(loginBody);
                await TestGET(`${endpoint}/report`, 403, loginRes.body.data.accessToken);
            });
            test("invalid token", async () => {
                await TestGET(endpoint, 401);
                await TestGET(`${endpoint}/report`, 401);
            });
        });
    });

    describe("Post Like API", () => {
        let likeEndpoint: string;
        beforeAll(async () => {
            likeEndpoint = `${endpoint}/${newPost.postId}/like`;
        });
        describe("Create post_like API", () => {
            describe("성공", () => {
                test("Post - api/boards/:boardId/posts/:postId/like", async () => {
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
        describe("Get post_like API", () => {
            describe("성공", () => {
                test("Get - api/boards/:boardId/posts/:postId/like", async () => {
                    await TestGET(likeEndpoint, 200, accessToken);
                });
            });
            describe("Exception", () => {
                test("invalid token", async () => {
                    await TestGET(likeEndpoint, 401, "");
                });
            });
        });
        describe("Delete post_like API", () => {
            describe("성공", () => {
                test("Delete - api/boards/:boardId/posts/:postId/like", async () => {
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

    describe("Delete Post API", () => {
        describe("성공", () => {
            test("Delete - api/boards/:boardId/posts/:postId", async () => {
                await TestDELETE(`${endpoint}/${newPost.postId}`, 200, accessToken);
            });
        });
        describe("Exception", () => {
            test("not found", async () => {
                await TestDELETE(`${endpoint}/${newPost.postId + 100}`, 404, accessToken);
            });
            test("invalid token", async () => {
                await TestDELETE(`${endpoint}/${newPost.postId}`, 401, "");
            });
        });
    });
});
