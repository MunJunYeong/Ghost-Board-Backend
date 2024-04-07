import multer from "multer";
import path from "path";
import uuid4 from 'uuid4';

export const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomID = uuid4();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            done(null, filename);
        },
        destination(req, file, done) {
        },
    }),
    limits: { fileSize: 1024 * 1024 }
})