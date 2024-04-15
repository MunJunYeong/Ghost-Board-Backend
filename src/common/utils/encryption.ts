import bcrypt from "bcryptjs";

export const hashing = async (data: string) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(data, salt);
};

export const compareHashedValue = async (originalValue: string, hashedValue: string) => {
    // if equal return true
    return await bcrypt.compare(originalValue, hashedValue);
};
