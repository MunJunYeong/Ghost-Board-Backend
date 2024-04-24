import crypto from "crypto";

export const createCode = (byte?: number) => {
    return crypto.randomBytes(byte || 3).toString("hex");
};
