export const getResetPasswordTemplate = (resetUrl: string): string => {
  const brandColor = "#000000";
  const secondaryColor = "#666666";

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
      <div style="padding: 20px; text-align: center; background-color: #ffffff;">
        <img src="https://votre-domaine.com/logo.png" alt="EWA Print" style="width: 150px; height: auto;">
      </div>

      <div style="padding: 40px; background-color: #ffffff;">
        <h1 style="font-size: 20px; color: ${brandColor}; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Réinitialisation de votre mot de passe</h1>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valable 1 heure.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            RÉINITIALISER MON MOT DE PASSE
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">

        <h1 style="font-size: 20px; color: ${brandColor}; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Reset Your Password</h1>
        <p style="color: ${secondaryColor}; line-height: 1.5;">You requested to reset your password. Click the button below to create a new password. This link is valid for 1 hour.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            RESET MY PASSWORD
          </a>
        </div>
      </div>

      <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #999999;">
        <p>© ${new Date().getFullYear()} EWA Print. Tous droits réservés / All rights reserved.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
      </div>
    </div>
  `;
};
