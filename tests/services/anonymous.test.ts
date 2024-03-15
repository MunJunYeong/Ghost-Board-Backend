import request from "supertest";
import app from "../setup";

interface userBody {
    userID: string;
    password: string;
    username: string;
    email: string;
}

describe("회원가입 API", () => {
    let body: userBody;
    beforeEach(() => {
        body = {
            userID: "test1234",
            password: "test5678",
            username: "testuser",
            email: "test@a.com",
        };
    });

    describe("회원가입 성공", () => {
        test("signup", async () => {
            const response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Request Validation", () => {
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
        test("signup", async () => {
            const response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
        test("signup", async () => {
            const response: any = await request(app).post("/api/signup").send(body);
            expect(response.statusCode).toBe(400);
        });
    });
});
