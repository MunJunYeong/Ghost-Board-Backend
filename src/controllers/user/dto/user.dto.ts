import { IsEmail, IsOptional, IsString } from "@utils/validation";

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
