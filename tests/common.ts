import request from "supertest";
import app, { defaultID, defaultPwd } from "./setup";

export const GetAccessToken = async () => {
    const loginBody = {
        id: defaultID,
        password: defaultPwd,
    };
    const loginRes: any = await request(app).post(`/api/login`).send(loginBody);
    return loginRes.body.data.accessToken;
};

export const CreateBoard = async (accessToken: string) => {
    const boardBody = {
        title: "test",
        description: "test desc",
    };
    const boardRes: any = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(boardBody);
    return boardRes.body.data;
};

export const CreatePost = async (accessToken: string, boardId: any) => {
    const postBody = {
        title: "test post",
        content: "test post desc",
        isAnonymous: true,
    };
    const postRes: any = await request(app)
        .post(`/api/boards/${boardId}/posts`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(postBody);
    return postRes.body.data;
};

export const DeleteBoard = async (accessToken: string, boardId: any) => {
    await request(app).delete(`/api/boards/${boardId}`).set("Authorization", `Bearer ${accessToken}`);
};

export const DeletePost = async (accessToken: string, boardId: any, postId: any) => {
    await request(app).delete(`/api/boards/${boardId}/posts/${postId}`).set("Authorization", `Bearer ${accessToken}`);
};

export const TestGET = async (endpoint: string, statusCode: number, token?: string) => {
    const response: any = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    try {
        expect(response.statusCode).toBe(statusCode);
    } catch (error) {
        console.log(response.body);
        throw error;
    }
};

export const TestPOST = async (endpoint: string, body: any, statusCode: number, token?: string) => {
    const response: any = await request(app).post(endpoint).send(body).set("Authorization", `Bearer ${token}`);
    try {
        expect(response.statusCode).toBe(statusCode);
    } catch (error) {
        console.log(response.body);
        throw error;
    }
};

export const TestPUT = async (endpoint: string, body: any, statusCode: number, token?: string) => {
    const response: any = await request(app).put(endpoint).send(body).set("Authorization", `Bearer ${token}`);
    try {
        expect(response.statusCode).toBe(statusCode);
    } catch (error) {
        console.log(response.body);
        throw error;
    }
};

export const TestDELETE = async (endpoint: string, statusCode: number, token?: string) => {
    const response: any = await request(app).delete(endpoint).set("Authorization", `Bearer ${token}`);
    try {
        expect(response.statusCode).toBe(statusCode);
    } catch (error) {
        console.log(response.body);
        throw error;
    }
};
