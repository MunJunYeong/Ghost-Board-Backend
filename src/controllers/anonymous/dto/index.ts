import { IsString, MinLength } from "@utils/validation";

export class LoginReqDTO {
    @IsString()
    @MinLength(3, {
        message: "ID is too short",
    })
    id!: string;

    @IsString()
    @MinLength(6, {
        message: "Password is too short",
    })
    password!: string;
}

export class LoginResDTO {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;
}
