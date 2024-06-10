import request from "supertest";
import app from "./setup";

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
