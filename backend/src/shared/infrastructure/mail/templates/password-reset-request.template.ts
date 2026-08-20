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
    </div>
  `;
};
