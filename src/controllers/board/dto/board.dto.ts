import { IsString } from "class-validator";

export class CreateBoardReqDTO {
    @IsString()
    title!: string

    @IsString()
    description!: string
}