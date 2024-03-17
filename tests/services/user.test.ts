import request from "supertest";
import app from "../setup";
import User from "@models/user";

interface userBody {
    userID?: string;
    password?: string;
    username?: string;
    email?: string;
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
        test("empty & invalid email", async () => {
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
            expect(result.password).toEqual(""); // password는 FE측으로 유출해선 안된다.
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

describe("Update User API", () => {
    let body: userBody;
    beforeEach(() => {
        body = {
            userID: "", // not used this test
            username: "",
            password: "",
            email: "",
        };
    });
    describe("성공", () => {
        test(`Put - /api/users/{id}) - username`, async () => {
            body.username = "changeduser123"
            delete body.email
            const response: any = await request(app).put(`/api/users/${createdUser.id}`).send(body);
            expect(response.statusCode).toBe(200);

            const result: userBody = response.body.data;
            expect(result.username).toEqual(body.username);
        });
        test(`Put - /api/users/{id}) - password`, async () => {
            body.password = "changeduser313"
            delete body.email
            const response: any = await request(app).put(`/api/users/${createdUser.id}`).send(body);
            expect(response.statusCode).toBe(200);
        });
        test(`Put - /api/users/{id}) - email`, async () => {
            body.email = "changeduser@naver.com"
            const response: any = await request(app).put(`/api/users/${createdUser.id}`).send(body);
            expect(response.statusCode).toBe(200);

            const result: userBody = response.body.data;
            expect(result.email).toEqual(body.email);
        });
    });
    describe("Exception", () => {
        test("invalid email", async () => {
            body.email = "invalidemailformat"
            const response: any = await request(app).put(`/api/users/${createdUser.id}`).send(body);
            expect(response.statusCode).toBe(400);
        });
        test("not found user", async () => {
            body.email = "changeduser@naver.com"
            const response: any = await request(app).put(`/api/users/${createdUser.id + 100}`).send(body);
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
