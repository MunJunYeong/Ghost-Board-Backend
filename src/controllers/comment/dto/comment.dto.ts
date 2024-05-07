import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "@utils/validation";

export class CreateCommentReqDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: "content is too long" })
    content!: string;

    @IsOptional()
    parentCommentId!: any;

    @IsBoolean()
    isAnonymous!: boolean;
}
