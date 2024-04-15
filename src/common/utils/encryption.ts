import bcrypt from "bcryptjs";

export const hashing = async (data: string) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(data, salt);
};

export const comparePassword = async (pwd: string, hashedPwd: string) => {
    // if login success - return true
    return await bcrypt.compare(pwd, hashedPwd);
};
