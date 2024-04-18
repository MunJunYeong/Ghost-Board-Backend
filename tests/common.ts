import request from "supertest";
import app from "./setup";

export const TestPOST = async (endpoint: string, body: any, statusCode: number) => {
    let response: any = await request(app).post(endpoint).send(body);
    expect(response.statusCode).toBe(statusCode);
};
