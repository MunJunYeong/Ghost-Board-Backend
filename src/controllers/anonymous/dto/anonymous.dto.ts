import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "@utils/validation";

export class SignupReqDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "ID is too short" })
    @MaxLength(15, { message: "ID is too long" })
    userID!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Password is too short" })
    @MaxLength(20, { message: "Password is too long" })
    password!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

export class LoginReqDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "ID is too short" })
    @MaxLength(15, { message: "ID is too long" })
    userID!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Password is too short" })
    @MaxLength(20, { message: "Password is too long" })
    password!: string;
}

export class LoginResDTO {
    @IsString()
    @IsNotEmpty()
    accessToken!: string;

    @IsString()
    @IsNotEmpty()
    refreshToken!: string;
}
