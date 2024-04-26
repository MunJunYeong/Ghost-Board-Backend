import { ReportReason } from "@models/post_report";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "@utils/validation";

interface UploadedImage {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentDisposition: string | null;
    contentEncoding: string | null;
    storageClass: string;
    serverSideEncryption: string | null;
    metadata: any; // 또는 원하는 메타데이터의 타입으로 변경 가능
    location: string;
    etag: string;
    versionId: string | null;
}

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

    image?: UploadedImage; // Express.Multer.File의 type이 아닌 multer-s3의 type이라서 사전 정의
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

export class CreatePostReportReqDTO {
    @IsEnum(ReportReason, { message: "Invalid report reason" }) // ReportReason enum에 속하는지 확인
    @IsNotEmpty({ message: "Report reason is required" })
    reason!: string;
}
