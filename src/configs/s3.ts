import { S3Client } from "@aws-sdk/client-s3";

export const S3Configs = {
    s3AccessKey: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
    s3Region: process.env.S3_REGION || "ap-northeast-2",
    s3Bucket: process.env.S3_BUCKET_NAME || "",
};

export const S3Storage = new S3Client({
    region: S3Configs.s3Region,
    credentials: {
        accessKeyId: S3Configs.s3AccessKey,
        secretAccessKey: S3Configs.secretAccessKey,
    }
});
