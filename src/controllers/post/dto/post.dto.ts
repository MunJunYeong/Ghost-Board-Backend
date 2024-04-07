import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "@utils/validation";

export class CreatePostReqDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: "Title is too short" })
    @MaxLength(100, { message: "Title is too long" })
    title!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: "Content is too short" })
    @MaxLength(1000, { message: "Content is too long" })
    content!: string;
}

export class UpdatePostReqDTO {
    @IsString()
    @IsOptional()
    @MinLength(5, { message: "Title is too short" })
    @MaxLength(100, { message: "Title is too long" })
    title!: string;

    @IsString()
    @IsOptional()
    @MinLength(10, { message: "Content is too short" })
    @MaxLength(1000, { message: "Content is too long" })
    content!: string;
}
