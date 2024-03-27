import { IsEmail, IsNotEmpty, IsOptional, IsString } from "@utils/validation";

export class CreatePostReqDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
}

export class UpdatePostReqDTO {
    @IsString()
    @IsOptional()
    title!: string;

    @IsString()
    @IsOptional()
    description!: string;
}
