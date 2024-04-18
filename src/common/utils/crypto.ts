import crypto from "crypto";

export const createCode = () => {
    return crypto.randomBytes(3).toString("hex");
};
