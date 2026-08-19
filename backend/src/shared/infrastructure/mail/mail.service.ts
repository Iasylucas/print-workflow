import { env } from "@/config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (to: string, subject: string, html: string) => {
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
        email: env.MAIL_USER,
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

  return data;
};
