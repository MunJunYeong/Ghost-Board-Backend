import { IsEmail, IsNotEmpty, IsString, MinLength } from "@utils/validation";

export class SignupReqDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    userID!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

export class LoginReqDTO {
    @IsString()
    @MinLength(3, { message: "ID is too short" })
    @IsNotEmpty()
    id!: string;

    @IsString()
    @MinLength(6, { message: "Password is too short" })
    @IsNotEmpty()
    password!: string;
}

export class LoginResDTO {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;
}
