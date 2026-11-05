### Étape 1 : Installer les dépendances

```bash
# Backend
cd backend
pnpm install

# Frontend
cd frontend
pnpm install
```

---

### Étape 2 : Créer la base de données

1. Créez un compte sur https://neon.tech ou autre
2. Créez un projet
3. Copiez l'URL de connexion → `DATABASE_URL`

---

### Étape 3 : Créer les tables

```bash
cd backend
npx prisma db push
```

---

### Étape 4 : Remplir les données initiales

```bash
# Créer le compte administrateur
pnpm seedadmin

# Créer le catalogue produits
pnpm seedproduct
```

**Admin par défaut :**

- Email : `admin@ewaprint.com`
- Mot de passe : `Admin123!`

---
