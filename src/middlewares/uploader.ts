import { S3Configs, S3Storage } from '@configs/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from "path";
import uuid4 from "uuid4";

export const uploadMiddleware = multer({
    storage: multerS3({
        s3: S3Storage,
        bucket: S3Configs.s3Bucket,
        acl: "public-read-write",
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key(req, file, cb) {
            // filename 
            const randomID = uuid4();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            cb(null, `image/${Date.now()}_${filename}`)
        },
    }),
    // 5MB 용량 제한
    limits: { fileSize: 5 * 1024 * 1024 },
})
