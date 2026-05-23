export const getEmailChangeRequestTemplate = (
  confirmUrl: string,
  currentEmail: string,
): string => {
  const brandColor = "#000000";
  const secondaryColor = "#666666";

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
      <div style="padding: 20px; text-align: center; background-color: #ffffff;">
        <img src="https://votre-domaine.com/logo.png" alt="EWA Print" style="width: 150px; height: auto;">
      </div>

      <div style="padding: 40px; background-color: #ffffff;">
        <h1 style="font-size: 20px; color: ${brandColor}; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Confirmation de changement d'email</h1>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Une demande de changement d'email a été initiée pour votre compte.</p>
        <p style="color: ${secondaryColor}; line-height: 1.5;"><strong>Email actuel :</strong> ${currentEmail}</p>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Cliquez sur le bouton ci-dessous pour confirmer votre nouvelle adresse email. Ce lien est valable 1 heure.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            CONFIRMER LE CHANGEMENT
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">

        <h1 style="font-size: 20px; color: ${brandColor}; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Email Change Confirmation</h1>
        <p style="color: ${secondaryColor}; line-height: 1.5;">A request to change your email has been made for your account.</p>
        <p style="color: ${secondaryColor}; line-height: 1.5;"><strong>Current email:</strong> ${currentEmail}</p>
        <p style="color: ${secondaryColor}; line-height: 1.5;">Click the button below to confirm your new email address. This link is valid for 1 hour.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            CONFIRM CHANGE
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
