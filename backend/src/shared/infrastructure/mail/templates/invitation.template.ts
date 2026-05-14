export const getInvitationTemplate = (url: string, role: string) => `
  <h1>Bienvenue chez EWA Print</h1>
  <p>Vous avez été invité en tant que <strong>${role}</strong>.</p>
  <p>Cliquez sur le lien ci-dessous pour finaliser votre compte (valable 48h) :</p>
  <a href="${url}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none;">
    Activer mon compte
  </a>
`;
