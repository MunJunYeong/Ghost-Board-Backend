import bcrypt from "bcryptjs";

export const hashing = async (pwd: string) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(pwd, salt);
};

export const comparePassword = async (pwd: string, hashedPwd: string) => {
    // if login success - return true
    return await bcrypt.compare(pwd, hashedPwd);
};
