import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "@utils/validation";

export class SignupReqDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "ID is too short" })
    @MaxLength(15, { message: "ID is too long" })
    id!: string;

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
    id!: string;

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

export class SendIDReqDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    username!: string;
}

export class EmailReqDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

export class CheckEmailReqDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    code!: string;
}

export class ChangePasswordReqDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}
