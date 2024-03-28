import User from "@models/user";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "@utils/validation";

export class UpdateUserReqDTO {
    @IsString()
    @IsOptional()
    password!: string;

    @IsString()
    @IsOptional()
    username!: string;

    @IsOptional()
    @IsEmail()
    email!: string; // IsOptional + IsEmail - 애초에 email key가 오면 안됨.
}

export class UserResponseDTO {
    @IsNumber()
    @IsNotEmpty()
    userId!: number;

    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;
}