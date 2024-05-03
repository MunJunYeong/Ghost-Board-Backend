import request from "supertest";
import app, { defaultID, defaultUsername, mockEmailCode } from "../setup";
import { TestDELETE, TestGET, TestPOST, TestPUT } from "../common";
import * as anonyDTO from "@controllers/anonymous/dto/anonymous.dto";

let accessToken: string;
let refreshToken: string;

// test용 user data
const id = "test1234";
const password = "test5678";
const username = "testuser";
const email = "test1234@corelinesoft.com";

describe("User API", () => {
    interface userBody {
        userId?: number;
        id?: string;
        password?: string;
        username?: string;
        email?: string;
    }
    let createdUser: userBody;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signup
    describe("Signup API - send email", () => {
        let body: anonyDTO.EmailReqDTO;
        const endpoint = "/api/signup/send-email";
        beforeEach(() => {
            body = {
                email: email,
            };
        });

        describe("성공", () => {
            test("Post - api/signup/send-email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("invalid domain (email)", async () => {
                body.email = "dsafa1231@naver.com";
                await TestPOST(endpoint, body, 400);
            });
            test("already exist username", async () => {
                body.email = defaultUsername;
                await TestPOST(endpoint, body, 400);
            });
        });
    });

    describe("Signup API - check email", () => {
        const endpoint = "/api/signup/check-email";
        let body: anonyDTO.CheckEmailReqDTO;
        beforeEach(() => {
            body = {
                email: email,
                code: mockEmailCode,
            };
        });

        describe("성공", () => {
            test("Post - api/signup/check-email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("invalid domain (email)", async () => {
                body.email = "test123@naver.com";
                await TestPOST(endpoint, body, 400);
            });
            test("invalid code", async () => {
                body.code = "asa133";
                await TestPOST(endpoint, body, 404);
            });
        });
    });

    describe("Signup API - check username", () => {
        let body: anonyDTO.CheckUsernameReqDTO;
        const endpoint = "/api/signup/check-username";
        beforeEach(() => {
            body = {
                username: username,
            };
        });

        describe("성공", () => {
            test("Post - api/signup/check-email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("alreay exist username", async () => {
                body.username = defaultUsername;
                await TestPOST(endpoint, body, 400);
            });
            test("invalid body", async () => {
                body.username = "";
                await TestPOST(endpoint, body, 400);
            });
        });
    });

    describe("Signup API", () => {
        let body: anonyDTO.SignupReqDTO;
        const endpoint = "/api/signup";
        beforeEach(() => {
            body = {
                id: id,
                password: password,
                username: username,
                email: email,
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
                await TestPOST(endpoint, body, 400);
            });
            test("empty password", async () => {
                body.password = "";
                await TestPOST(endpoint, body, 400);
            });
            test("empty username", async () => {
                body.username = "";
                await TestPOST(endpoint, body, 400);
            });
            test("empty & invalid email", async () => {
                body.email = "";
                await TestPOST(endpoint, body, 400);

                body.email = "adga12113";
                await TestPOST(endpoint, body, 400);

                // 이메일 인증이 안된 이메일
                body.email = "dnflalk123@corelinesoft.com";
                await TestPOST(endpoint, body, 401);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // login
    describe("Login API", () => {
        let body: anonyDTO.LoginReqDTO;
        const endpoint = "/api/login";
        beforeEach(() => {
            body = {
                id: id,
                password: password,
            };
        });
        describe("성공", () => {
            test("Post - /api/login", async () => {
                const response: any = await request(app).post(endpoint).send(body);
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
                await TestPOST(endpoint, body, 400);

                // invalid id case
                body.id = "adnklal131";
                await TestPOST(endpoint, body, 404);
            });
            test("empty, invalid password", async () => {
                // empty case
                body.password = "";
                await TestPOST(endpoint, body, 400);
                // invalid password case
                body.password = "13nlflaqp1";
                await TestPOST(endpoint, body, 404);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Find ID
    describe("Find ID API", () => {
        const endpoint = "/api/find-id";

        describe("성공", () => {
            test("Get - api/find-id/:email", async () => {
                const response: any = await request(app).get(`${endpoint}/${email}`);
                expect(response.statusCode).toBe(200);
                expect(response.body.data.id).toEqual("test1***");
                expect(response.body.data.username).toEqual("testuser");
            });
        });
        describe("Exception", () => {
            test("alreay exist username", async () => {
                await TestGET(`${endpoint}/adsnk2@corelinesoft.com`, 404);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Change Password
    describe("Change Password API - send email", () => {
        const endpoint = "/api/change-password/send-email";
        let body: anonyDTO.EmailReqDTO;
        beforeEach(() => {
            body = {
                email: email,
            };
        });
        describe("성공", () => {
            test("Get - api/find-id/:email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("invalid domain (email)", async () => {
                body.email = "dsafa1231@naver.com";
                await TestPOST(endpoint, body, 400);
            });
            test("already exist username", async () => {
                body.email = defaultUsername;
                await TestPOST(endpoint, body, 400);
            });
        });
    });

    describe("Change Password API - check email", () => {
        const endpoint = "/api/change-password/check-email";
        let body: anonyDTO.CheckEmailReqDTO;
        beforeEach(() => {
            body = {
                email: email,
                code: mockEmailCode,
            };
        });

        describe("성공", () => {
            test("Post - api/signup/check-email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("invalid domain (email)", async () => {
                body.email = "test123@naver.com";
                await TestPOST(endpoint, body, 400);
            });
            test("invalid code", async () => {
                body.code = "asa133";
                await TestPOST(endpoint, body, 404);
            });
        });
    });

    describe("Change Password API - change password", () => {
        const endpoint = "/api/change-password";
        let body: anonyDTO.ChangePasswordReqDTO;
        beforeEach(() => {
            body = {
                email: email,
                password: password + 123,
                username: username,
            };
        });

        describe("성공", () => {
            test("Post - api/signup/chnage-email", async () => {
                await TestPOST(endpoint, body, 200);
            });
        });
        describe("Exception", () => {
            test("invalid domain (email)", async () => {
                body.email = "test123@naver.com";
                await TestPOST(endpoint, body, 400);
            });
            test("unauthorization email", async () => {
                body.email = "test123@corelinesoft.com";
                await TestPOST(endpoint, body, 401);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Get user data API
    describe("Get User API", () => {
        const endpoint = "/api/users";
        describe("성공", () => {
            test("Get - /api/users/{id}", async () => {
                const response: any = await request(app)
                    .get(`${endpoint}/${createdUser.userId}`)
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
                await TestGET(`${endpoint}/${createdUser.userId! + 100}`, 404, accessToken);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UPdate user API
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
                await TestPUT(`/api/users/${createdUser.userId}`, body, 200, accessToken);
            });
            test(`Put - /api/users/{id}) - password`, async () => {
                body.password = "changeduser313";
                delete body.email;
                await TestPUT(`/api/users/${createdUser.userId}`, body, 200, accessToken);
            });
        });
        describe("Exception", () => {
            test("not found", async () => {
                body.email = "changeduser@naver.com";
                await TestPUT(`/api/users/${createdUser.userId! + 100}`, body, 404, accessToken);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Delete user API
    describe("Delete User API", () => {
        describe("성공", () => {
            test(`Delete - /api/users/{id})`, async () => {
                await TestDELETE(`/api/users/${createdUser.userId}`, 200, accessToken);
            });
        });
        describe("Exception", () => {
            test("not found user", async () => {
                await TestDELETE(`/api/users/${createdUser.userId}`, 404, accessToken);
            });
        });
    });
});
