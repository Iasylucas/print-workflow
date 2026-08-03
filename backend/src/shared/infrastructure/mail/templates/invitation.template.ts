import { prisma } from "@/config/prisma.js";

const companyInfo = await prisma.companyInfo.findFirst({
  orderBy: { createdAt: "desc" },
  select: { logo: true },
});

const logoUrl =
  companyInfo?.logo ||
  "https://res.cloudinary.com/demo/image/upload/v1/logo.png";

export const getInvitationTemplate = (url: string, role: string) => {
  const brandColor = "#000000"; // Noir pur pour EWA Print
  const secondaryColor = "#666666";

  console.log(logoUrl);

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
      <!-- Header avec Logo -->
      <div style="padding: 20px; text-align: center; background-color: #ffffff;">
        <img src=${logoUrl} alt="EWA Print" style="width: 150px; height: auto;">
      </div>

      <!-- Corps du mail (Français) -->
      <div style="padding: 40px; background-color: #ffffff;">
        <h1 style="font-size: 20px; color: ${brandColor}; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Bienvenue chez EWA Print</h1>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Vous avez été invité à rejoindre notre plateforme ERP en tant que <strong>${role}</strong>.</p>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Cliquez sur le bouton ci-dessous pour finaliser la création de votre compte. Ce lien est valable pendant 48 heures.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            ACTIVER MON COMPTE
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
      </div>

      <!-- Footer -->
      <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #999999;">
        <p>© ${new Date().getFullYear()} EWA Print. Tous droits réservés / All rights reserved.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
      </div>
    </div>
  `;
};
