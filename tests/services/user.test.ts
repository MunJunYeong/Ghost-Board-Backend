import request from "supertest";
import app from "../setup";

interface userBody {
    userId?: number;
    id?: string;
    password?: string;
    username?: string;
    email?: string;
}

// test용 user data
let createdUser: userBody;
let accessToken: string;
let refreshToken: string;


describe("User API", () => {
    describe("Signup API", () => {
        let body: userBody;
        beforeEach(() => {
            body = {
                id: "test1234",
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
            test("empty id", async () => {
                body.id = "";
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

    describe("Login API", () => {
        let body: any;
        beforeEach(() => {
            body = {
                id: "test1234",
                password: "test5678",
            };
        });
        describe("성공", () => {
            test("Post - /api/login", async () => {
                const response: any = await request(app).post(`/api/login`).send(body);
                expect(response.statusCode).toBe(200);

                const result = response.body.data;
                accessToken = result.accessToken;
                refreshToken = result.refreshToken;
                expect(result.accessToken).not.toBeNull();
                expect(result.refreshToken).not.toBeNull();
            });
        });
        describe("Exception", () => {
            test("empty, invalid userID", async () => {
                // empty case
                body.id = "";
                let response: any = await request(app).post(`/api/login`).send(body);
                expect(response.statusCode).toBe(400);

                // invalid id case
                body.id = "adnklal131";
                response = await request(app).post(`/api/login`).send(body);
                expect(response.statusCode).toBe(404);
            });
            test("empty, invalid password", async () => {
                // empty case
                body.password = "";
                let response: any = await request(app).post(`/api/login`).send(body);
                expect(response.statusCode).toBe(400);

                // invalid password case
                body.password = "13nlflaqp1";
                response = await request(app).post(`/api/login`).send(body);
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("Get User API", () => {
        describe("성공", () => {
            test("Get - /api/users/{id}", async () => {
                const response: any = await request(app)
                    .get(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);

                const result: userBody = response.body.data;
                expect(result.id).toEqual(createdUser.id);
                expect(result.password).toBeUndefined();
                expect(result.username).toEqual(createdUser.username);
                expect(result.email).toEqual(createdUser.email);
            });
        });
        describe("Exception", () => {
            test("not found user", async () => {
                const response: any = await request(app)
                    .get(`/api/users/${createdUser.userId! + 100}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe("Update User API", () => {
        let body: userBody;
        beforeEach(() => {
            body = {
                userId: 0, // not used this test
                id: "", // not used this test
                username: "",
                password: "",
                email: "",
            };
        });
        describe("성공", () => {
            test(`Put - /api/users/{id}) - username`, async () => {
                body.username = "changeduser123";
                delete body.email;
                const response: any = await request(app)
                    .put(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);

                const result: userBody = response.body.data;
                expect(result.username).toEqual(body.username);
            });
            test(`Put - /api/users/{id}) - password`, async () => {
                body.password = "changeduser313";
                delete body.email;
                const response: any = await request(app)
                    .put(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);
            });
            test(`Put - /api/users/{id}) - email`, async () => {
                body.email = "changeduser@naver.com";
                const response: any = await request(app)
                    .put(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(200);

                const result: userBody = response.body.data;
                expect(result.email).toEqual(body.email);
            });
        });
        describe("Exception", () => {
            test("invalid email", async () => {
                body.email = "invalidemailformat";
                const response: any = await request(app)
                    .put(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body);
                expect(response.statusCode).toBe(400);
            });
            test("wrong authenticated", async () => {
                body.email = "changeduser@naver.com";
                const response: any = await request(app)
                    .put(`/api/users/${createdUser.userId! + 100}`)
                    .send(body);
                expect(response.statusCode).toBe(401);
            });
        });
    });

    describe("Delete User API", () => {
        describe("성공", () => {
            test(`Delete - /api/users/{id})`, async () => {
                const response: any = await request(app)
                    .delete(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(200);
            });
        });
        describe("Exception", () => {
            test("not found user", async () => {
                const response: any = await request(app)
                    .delete(`/api/users/${createdUser.userId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(response.statusCode).toBe(404);
            });
        });
    });
})

