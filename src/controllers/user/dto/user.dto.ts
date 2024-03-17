import { IsEmail, IsOptional, IsString } from "@utils/validation";

export class UpdateUserReqDTO {
    @IsString()
    @IsOptional()
    password!: string;
    
    @IsString()
    @IsOptional()
    username!: string;
    
    @IsEmail()
    @IsOptional()
    email!: string;
}
