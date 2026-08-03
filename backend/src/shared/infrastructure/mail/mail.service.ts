import nodemailer from "nodemailer";
import { env } from "@/config/env.js";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  auth: {
    user: env.MAIL_AUTH,
    pass: env.MAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `${env.MAIL_USER}`,
    to,
    subject,
    html,
  });
};
