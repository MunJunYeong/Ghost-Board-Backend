import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBoardReqDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "Title is too short" })
    @MaxLength(15, { message: "Title is too long" })
    title!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: "Description is too long" })
    description!: string;
}
