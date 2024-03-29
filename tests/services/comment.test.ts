import request from "supertest";
import app, { defaultID, defaultPwd } from "../setup";

import Board from "@models/board";
import Post from "@models/post";
import { CreateCommentReqDTO } from "@controllers/comment/dto/comment.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// precondition

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let newComment: Comment;

describe("Comment API", () => {
    let accessToken: string;
    let board: Board;
    let post: Post;
    let endpoint: string;
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
            description: "test post desc",
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
                content: "test comment",
                parentCommentId: null,
            };
        });

        describe("성공", () => {
            test("Post - api/boards/:boardId/posts/:postId/comments", async () => {
                const response: any = await request(app)
                    .post(`${endpoint}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                console.log(endpoint);
                console.log(response);
                console.log(response.body);
                expect(response.statusCode).toBe(200);
                newComment = response.body.data;
            });
        });
        describe("Exception", () => {});
    });
});
