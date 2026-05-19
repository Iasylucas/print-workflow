// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
provider = "prisma-client"
output = "../src/generated/prisma"
}

datasource db {
provider = "postgresql"
}

model Client {
id String @id @default(cuid())
firstName String?
lastName String
email String? @unique
phone String?
address String?
createdAt DateTime @default(now())

orders Order[]
invoices Invoice[]
quotes Quote[]
}

model User {
id String @id
email String @unique
password String?
role String
isActif Boolean @default(false)
firstName String?
lastName String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?

fichiers Fichier[]
paiements Paiement[]
notes Note[]

devisCrees Quote[] @relation("UserDevis")
facturesCrees Invoice[] @relation("UserFacture")
ordersCrees Order[] @relation("UserOrder")

resetTokens PasswordResetToken[]
invitations InvitationToken[]
}

enum Role {
ADMIN
SALES
PRINTER
GRAPHIC_DESIGNER
}

model InvitationToken {
id String @id // UUIDv7
token String @unique // Le hash du token (sécurité)
email String // L'email invité
role Role // Le rôle pré-attribué
expiresAt DateTime // Date d'expiration (ex: 48h)
createdAt DateTime @default(now())
usedAt DateTime? // Pour marquer s'il a déjà servi

userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PasswordResetToken {
id String @id
tokenHash String @unique
expiresAt DateTime
createdAt DateTime @default(now())

userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@index([userId])
}

model EntrepriseInfo {
id Int @id @default(autoincrement())
version Int
nif String
stat String
rif String
adressePrincipale String
adressePrincipaleDetail String?
adresseAnnexe String
adresseAnnexeDetail String?
logo String?
cachet String?
actif Boolean @default(true)
dateDebut DateTime @default(now())
dateFin DateTime?

mobileMoneyNumbers Json?

telephoneStandard String?
emailContact String?

condition String?
delaisDeLivraison String?

ribTitulaire String?
ribDomiciliation String?
ribCode String?
infoRib String?

invoices Invoice[]
quotes Quote[]
}

model Quote {
id Int @id @default(autoincrement())
numero String @unique
date DateTime @default(now())
clientId String
client Client @relation(fields: [clientId], references: [id])

total Int
statut String @default("en_attente")

entrepriseInfoId Int
entrepriseInfo EntrepriseInfo @relation(fields: [entrepriseInfoId], references: [id])

// ⬇️ Lien vers la facture (si transformé)
factureTransformee Invoice? @relation("DevisToFacture")

createdById String
createdBy User @relation("UserDevis", fields: [createdById], references: [id])
// ⬇️ TOUTES les orders de CE quotes
orders Order[] // ← Prisma utilise quoteId

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Invoice {
id Int @id @default(autoincrement())
numero String @unique
date DateTime @default(now())
clientId String
client Client @relation(fields: [clientId], references: [id])

total Int
acompte Int @default(0)
reste Int

lieuLivraison String?
dateLivraisonPrevue DateTime?

estLivree Boolean @default(false)
statutPaiement String @default("non_payee")

entrepriseInfoId Int
entrepriseInfo EntrepriseInfo @relation(fields: [entrepriseInfoId], references: [id])

// ⬇️ Lien vers le quotes original (si cette facture vient d'un quotes)
devisOrigineId Int? @unique
devisOrigine Quote? @relation("DevisToFacture", fields: [devisOrigineId], references: [id])

createdById String
createdBy User @relation("UserFacture", fields: [createdById], references: [id])

// ⬇️ TOUTES les orders de CETTE facture
orders Order[] // ← Prisma utilise factureId

paiements Paiement[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Fichier {
id String @id
url String
nom String
type String

orderId Int
order Order @relation(fields: [orderId], references: [id])

uploadedById String
uploadedBy User @relation(fields: [uploadedById], references: [id])

createdAt DateTime @default(now())
}

model Paiement {
id Int @id @default(autoincrement())

factureId Int
facture Invoice @relation(fields: [factureId], references: [id])

montant Int

mode String
reference String?

date DateTime @default(now())

encaisseParId String
encaissePar User @relation(fields: [encaisseParId], references: [id])
}

model Note {
id Int @id @default(autoincrement())
texte String

userId String
user User @relation(fields: [userId], references: [id])

orderId Int
order Order @relation(fields: [orderId], references: [id])

createdAt DateTime @default(now())
}

model AppSettings {
id Int @id @default(1)
maxInscriptions Int @default(10)
inscriptionsOuvertes Boolean @default(true)
updatedAt DateTime @updatedAt
}

model Order {
id Int @id @default(autoincrement())
reference String @unique
designation String

clientId String
client Client @relation(fields: [clientId], references: [id])

quoteId Int?
factureId Int?

quotes Quote? @relation(fields: [quoteId], references: [id])
facture Invoice? @relation(fields: [factureId], references: [id])

// La variante choisie (ex: Vinyle prédécoupé)
variantId String
variant ProductVariant @relation(fields: [variantId], references: [id])

options Json? // ex: { "format": "A4", "rectoVerso": false }

pricingRuleId String
pricingRule PricingRule @relation(fields: [pricingRuleId], references: [id])

largeurPieceCm Float?
hauteurPieceCm Float?

statut String @default("en_attente_fichier")
quantite Int
prixUnitaire Int
prixTotal Int // prix total de la ligne de order au moment de la création

createdById String
createdBy User @relation("UserOrder", fields: [createdById], references: [id])

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?

fichiers Fichier[]
notes Note[]
}

model Product {
id String @id @default(cuid())
name String
slug String @unique
category String? // "impression", "signaletique", "textile", etc.
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

variants ProductVariant[]
}

model ProductVariant {
id String @id @default(cuid())
productId String
product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
name String // "Prédécoupé", "Sans découpe", "Recto", "Recto verso", "Standard", "Luxe"
active Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

orders Order[]
pricingRules PricingRule[]
}

model PricingRule {
id String @id @default(cuid())
variantId String
variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
pricingMode PricingMode
label String? // "Prix au m²", "Prix A4", "Prix standard", etc.
config Json // Structure validée par Zod selon pricingMode
priority Int @default(0) // pour l’ordre d’affichage
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

orders Order[]
@@index([variantId])
}

enum PricingMode {
FIXED // prix fixe (mug, t-shirt)
PER_M2 // prix au mètre carré (bâche, vinyle sans découpe)
PER_UNIT // prix à l’unité (carte visite)
FORMAT // prix par format (PVC: A4, A3, A2...)
RECTO_VERSO // recto / recto verso (flyers)
PER_METER // prix au mètre linéaire (oriflamme)
OPTION // supplément (oeillet, laminage, pose)
COMPOSITE // combinaison de plusieurs règles (prédécoupé: m² + A4)
}

model Format {
id String @id @default(cuid())
name String @unique // "A4", "A3", "A2", "A1", "A0"
widthMm Int // largeur en mm
heightMm Int // hauteur en mm
createdAt DateTime @default(now())
}

// Configuration atelier (une seule ligne active)
model ConfigurationAtelier {
id String @id @default(cuid())
largeurMaxM Float @default(1.5)
margeDecoupeM Float @default(0.02)
surfaceReferenceM2 Json @default("{\"largeur\":1.5,\"hauteur\":0.7}")
actif Boolean @default(true)
}
