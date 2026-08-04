// import nodemailer from "nodemailer";
// import { env } from "@/config/env.js";

// const transporter = nodemailer.createTransport({
//   host: env.MAIL_HOST,
//   port: Number(env.MAIL_PORT),
//   auth: {
//     user: env.MAIL_AUTH,
//     pass: env.MAIL_PASS,
//   },
// });

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   await transporter.sendMail({
//     from: `${env.MAIL_USER}`,
//     to,
//     subject,
//     html,
//   });
// };

import { env } from "@/config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (to: string, subject: string, html: string) => {
  // Version texte brute auto-générée depuis le HTML
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.MAIL_PASS,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: env.MAIL_USER, // ← réutilise ton env existante
        name: "EWA Print",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("❌ Brevo API error:", errorBody);
    throw new Error(`Brevo API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  // console.log("✅ Email envoyé ! Message ID:", data.messageId);

  return data;
};
