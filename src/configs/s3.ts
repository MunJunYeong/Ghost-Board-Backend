import AWS from "aws-sdk";

const S3Configs = {
    s3AccessKey: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3Region: process.env.S3_REGION,
};

const storage: AWS.S3 = new AWS.S3({
    accessKeyId: S3Configs.s3AccessKey,
    secretAccessKey: S3Configs.secretAccessKey,
    region: S3Configs.s3Region,
});

export default storage;
