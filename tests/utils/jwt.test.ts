import { issueAccessToken, verifyAccessToken } from "@utils/lib/jwt";

let accessToken: string;
describe("jwt util", () => {
    const payload = {
        userId: 1,
        id: "test1234",
        username: "testuser",
        email: "test@test.com",
    };

    describe("성공", () => {
        test("issueAccessToken", async () => {
            accessToken = issueAccessToken(payload);
            // length가 1 이상이어야 한다.
            expect(accessToken.length).toBeGreaterThan(1);
        });
        test("verifyAccessToken", async () => {
            const result = verifyAccessToken(accessToken);
            expect(result.error).toBeNull();

            const { id, userId, username, email } = result.user;
            expect(userId).toEqual(payload.userId);
            expect(id).toEqual(payload.id);
            expect(username).toEqual(payload.username);
            expect(email).toEqual(payload.email);
        });
    });
    describe("Exception", () => {
        test("jwt expired", async () => {
            const invalidToken = "invalid.token";

            const result = verifyAccessToken(invalidToken);
            expect(result.valid).toBe(false);
            expect(result.error).not.toBeNull();
            expect(result.error.message).toEqual("jwt malformed");
        });
        test("jwt expired", async () => {
            const expiredToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcklEIjoidGVzdDEyMzQiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzExMDczNzUzLCJleHAiOjE3MTEwNzM3NTR9.0j2oUaFjY5nb1Zay-m7Du1OM2NkhSy9k6BZb4LAJ5wI";

            const result = verifyAccessToken(expiredToken);
            expect(result.valid).toBe(false);
            expect(result.error).not.toBeNull();
            expect(result.error.message).toEqual("jwt expired");
        });
    });
});
