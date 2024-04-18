import request from "supertest";
import app from "./setup";

export const TestGET = async (endpoint: string, statusCode: number, token?: string) => {
    let response: any = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(statusCode);
};

export const TestPOST = async (endpoint: string, body: any, statusCode: number, token?: string) => {
    let response: any = await request(app).post(endpoint).send(body).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(statusCode);
};

export const TestPUT = async (endpoint: string, body: any, statusCode: number, token?: string) => {
    let response: any = await request(app).put(endpoint).send(body).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(statusCode);
};

export const TestDELETE = async (endpoint: string, statusCode: number, token?: string) => {
    let response: any = await request(app).delete(endpoint).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(statusCode);
};
