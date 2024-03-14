import request from "supertest";
import app from "../setup";

describe("회원가입 API", () => {
    beforeAll(() => {
        //
    });

    afterAll(async () => {
        //
    });

    describe("Anonymous Service", () => {
        test("signup", async () => {
            const response: any = await request(app).post("/api/signup"); // 알맞은 URL을 여기에 입력하세요.

            // console.log(response);
            expect(response.statusCode).toBe(400);
        });
    });
});
