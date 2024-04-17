import nodeMailer from "nodemailer";
import ejs from "ejs";
import path from "path";

let transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
export const sendIDMail = async (userEmail: string, id: string) => {
    let emailTemplate;

    // ejs render할 때 상대경로를 인식하지 못함.
    const absolutePath = path.join(__dirname, "/email-template/findID.ejs");
    ejs.renderFile(absolutePath, { email: userEmail, id: id }, (err, data) => {
        //ejs mapping
        if (err) {
            console.error(err);
        }
        emailTemplate = data;
    });

    let info = await transporter.sendMail({
        from: `코어실록 아이디 찾기 결과`,
        to: userEmail,
        subject: "코어실록 아이디 결과 메일입니다.",
        html: emailTemplate,
    });
    return info;
};

export const sendSignUpMail = async (userEmail: string, code: string) => {
    let emailTemplate;

    // ejs render할 때 상대경로를 인식하지 못함.
    const absolutePath = path.join(__dirname, "/email-template/signUp.ejs");
    ejs.renderFile(absolutePath, { email: userEmail, code: code }, (err, data) => {
        //ejs mapping
        if (err) {
            console.error(err);
        }
        emailTemplate = data;
    });

    let info = await transporter.sendMail({
        from: `코어실록 이메일 인증`,
        to: userEmail,
        subject: "코어실록 회원가입 인증 메일입니다.",
        html: emailTemplate,
    });
    return info;
};

export const sendPasswordMail = async (userEmail: string, code: string) => {
    let emailTemplate;

    // ejs render할 때 상대경로를 인식하지 못함.
    const absolutePath = path.join(__dirname, "/email-template/findPassword.ejs");
    ejs.renderFile(absolutePath, { email: userEmail, code: code }, (err, data) => {
        //ejs mapping
        if (err) {
            console.error(err);
        }
        emailTemplate = data;
    });

    let info = await transporter.sendMail({
        from: `코어실록  비밀번호 변경 인증`,
        to: userEmail,
        subject: "코어실록 비밀번호 변경 인증 메일입니다.",
        html: emailTemplate,
    });
    return info;
};
