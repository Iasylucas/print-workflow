import nodemailer from "nodemailer";

// ⚠️ Identifiants en dur
const MAIL_HOST = "smtp-relay.brevo.com";
const MAIL_PORT = 587;
const MAIL_USER = "razafimahandryta@gmail.com";
const MAIL_PASS =
  "xsmtpsib-e7701d15dc928154666fde05f5cc4157006ad19179b9a5b9112675240bd30d82-TMMW0hnmOMOMn6vs";

console.log("📧 Test SMTP Brevo");
console.log("📧 MAIL_HOST:", MAIL_HOST);
console.log("📧 MAIL_USER:", MAIL_USER);

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: "b4355b001@smtp-brevo.com",
    pass: MAIL_PASS,
  },
});

async function main() {
  try {
    console.log("📨 Envoi en cours...");

    const info = await transporter.sendMail({
      from: `${MAIL_USER}`,
      to: "alvineiasyjoiakim@gmail.com",
      subject: "Test Brevo Final",
      html: "<p>Test avec Brevo</p>",
    });

    console.log("✅ Email envoyé !");
    console.log("📨 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

main();
