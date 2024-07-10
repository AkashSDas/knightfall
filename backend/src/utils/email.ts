import { createTransport } from "nodemailer";

export type EmailOptions = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

export async function sendEmail(opts: EmailOptions) {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) ?? 0,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const msg = {
        from: process.env.FROM_EMAIL,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
    };

    return await transporter.sendMail(msg);
}
