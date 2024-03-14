import request from "supertest";
import app from "../setup";

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("회원가입 API", () => {
    beforeAll(() => {
        //
    });

    afterAll(async () => {
        //
    });

    describe("서버 상태 확인", () => {
        test("기록 체크", async () => {
            const response: any = await request(app).post("/api/signup"); // 알맞은 URL을 여기에 입력하세요.

            // console.log(response);
            expect(response.statusCode).toBe(400);
        });
    });
});
