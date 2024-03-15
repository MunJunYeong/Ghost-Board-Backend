import request from "supertest";
import app from "../setup";
import User from "@models/user";

interface userBody {
    userID: string;
    password: string;
    username: string;
    email: string;
}

let createdUser: User;
describe("Signup API", () => {
    let body: userBody;
    beforeEach(() => {
        body = {
            userID: "test1234",
            password: "test5678",
            username: "testuser",
            email: "test@a.com",
        };
    });

    describe("성공", () => {
        test("Post - api/signup", async () => {
            const response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(200);
            createdUser = response.body.data;
        });
    });
    describe("Exception", () => {
        beforeEach(() => {
            body = {
                userID: "test1234",
                password: "test5678",
                username: "testuser",
                email: "test@a.com",
            };
        });
        test("empty userID", async () => {
            body.userID = "";
            let response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
        test("empty password", async () => {
            body.password = "";
            let response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
        test("empty username", async () => {
            body.username = "";
            let response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
        test("empty & wrong email", async () => {
            body.email = "";
            let response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);

            body.email = "adga12113";
            response = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
    });
});

describe("Get User API", () => {
    describe("성공", () => {
        test("Get - /api/users/{id}", async () => {
            const response: any = await request(app).get(`/api/users/${createdUser.id}`);
            expect(response.statusCode).toBe(200);

            const result: userBody = response.body.data;
            expect(result.userID).toEqual(createdUser.userID);
            expect(result.password).toEqual(createdUser.password);
            expect(result.username).toEqual(createdUser.username);
            expect(result.email).toEqual(createdUser.email);
        });
    });
    describe("Exception", () => {
        test("not found user", async () => {
            const response: any = await request(app).get(`/api/users/${createdUser.id + 100}`);
            expect(response.statusCode).toBe(404);
        });
    });
});

describe("Delete User API", () => {
    describe("성공", () => {
        test(`Delete - /api/users/{id})`, async () => {
            const response: any = await request(app).delete(`/api/users/${createdUser.id}`);
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Exception", () => {
        test("not found user", async () => {
            const response: any = await request(app).delete(`/api/users/${createdUser.id}`);
            expect(response.statusCode).toBe(404);
        });
    });
});
