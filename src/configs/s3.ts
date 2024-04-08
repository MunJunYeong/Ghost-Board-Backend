import AWS from "aws-sdk";

export const S3Configs = {
    s3AccessKey: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
    s3Region: process.env.S3_REGION || "ap-northeast-2",
    s3Bucket: process.env.S3_BUCKET_NAME || "",
};

export const S3Storage: AWS.S3 = new AWS.S3({
    accessKeyId: S3Configs.s3AccessKey,
    secretAccessKey: S3Configs.secretAccessKey,
    region: S3Configs.s3Region,
});
