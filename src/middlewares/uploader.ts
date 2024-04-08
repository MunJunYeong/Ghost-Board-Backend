import multer from "multer";
import path from "path";
import uuid4 from "uuid4";

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomID = uuid4();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            console.log(filename);
            done(null, filename);
        },
        destination: "uploads/",
    }),
    limits: { fileSize: 1024 * 1024 },
});

export const uploaderMiddleware = upload.single("image");
