export const getEmailChangeRequestTemplate = (
  confirmUrl: string,
  currentEmail: string,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Confirmation de changement d'email</h2>
      <p>Une demande de changement d'email a été initiée pour votre compte.</p>
      <p><strong>Email actuel :</strong> ${currentEmail}</p>
      <p>Cliquez sur le lien ci-dessous pour confirmer votre nouvelle adresse email :</p>
      <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Confirmer le changement</a>
      <p>Ce lien expire dans 1 heure.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>
  `;
};
