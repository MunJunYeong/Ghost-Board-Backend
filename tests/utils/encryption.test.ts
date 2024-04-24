import { compareHashedValue, hashing } from "@utils/lib/encryption";

describe("encryption util", () => {
    let pwd = "test1234";
    let hashedPwd = "";

    describe("성공", () => {
        test("hashing", async () => {
            hashedPwd = await hashing(pwd);
            expect(hashedPwd).not.toEqual(pwd);
        });
        test("compared", async () => {
            const isEqual = await compareHashedValue(pwd, hashedPwd);
            expect(isEqual).toEqual(true);
        });
    });
    describe("Exception", () => {
        test("not matched password", async () => {
            const wrongPwd = "wrongpassword";
            const isEqual = await compareHashedValue(wrongPwd, hashedPwd);
            expect(isEqual).toEqual(false);
        });
    });
});
