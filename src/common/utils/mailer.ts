import nodeMailer from "nodemailer"
import ejs from 'ejs';
import path from "path";

let transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendMail = async (userEmail: string, code: string) => {
    let emailTemplate;

    // ejs render할 때 상대경로를 인식하지 못함.
    const absolutePath = path.join(__dirname, 'registerVerify.ejs');
    ejs.renderFile(absolutePath, { email: userEmail, code: code }, (err, data) => { //ejs mapping
        if (err) {
            console.error(err)
        }
        emailTemplate = data;
    });

    let info = await transporter.sendMail({
        from: `코어실록 이메일 인증`,
        to: userEmail,
        subject: '코어실록 회원가입 인증 메일입니다.',
        html: emailTemplate,
    });
    return info
}