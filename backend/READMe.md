how the relation other all the table of the product works?:
Voici un manuel technique et explicatif complet et détaillé de votre catalogue de données. Ce document a été conçu pour servir de référence architecturale permanente. Vous pouvez le copier-coller et le sauvegarder dans un fichier README.md ou dans la documentation interne de votre projet ERP.

---

## 📘 MANUEL TECHNIQUE DU CATALOGUE PRODUITS & TARIFS (EWA PRINT)

## Ce manuel détaille le fonctionnement, l'architecture et la logique de calcul de la base de données relationnelle (PostgreSQL via Prisma) pour l'ERP d'imprimerie.

## 🏛️ PARTIE 1 : L'ARCHITECTURE DU TRIPTYQUE DE TABLES

Pour éviter la prolifération de dizaines de tables (une table pour les mugs, une table pour les vinyles, etc.), le système repose sur un triptyque de tables hautement normalisé et plat : Product $\rightarrow$ ProductVariant $\rightarrow$ PricingRule.

## 1. Diagramme des Relations (UML Conceptuel)

+-------------------+ +-----------------------+ +-------------------+

| PRODUCT | | PRODUCT_VARIANT | | PRICING_RULE |
+-------------------+ +-----------------------+ +-------------------+

| id (Int, PK) | 1 ------- _ | id (Int, PK) | 1 ------- _ | id (Int, PK) |
| name (String) | | productId (Int, FK) | | variantId (Int,FK)|
| slug (String, UQ) | | name (String) | | pricingMode(Enum) |
+-------------------+ +-----------------------+ | config (Json) |
+-------------------+

## 2. Anatomie et Clés de Jointure## A. La Table Product (Le Tronc)

- Rôle : Elle définit l'entité commerciale globale. Elle ne contient aucun prix, aucun détail technique.
- Clé Primaire (id) : Un entier séquentiel auto-incrémenté (1, 2, 3...). C'est la clé de voûte.
- Le slug : Une chaîne unique indexée (ex: vinyle-autocollant). Elle sert d'identifiant lisible pour les développeurs, le routage du front ou les URLs.

## B. La Table ProductVariant (Les Branches)

- Rôle : Elle matérialise les déclinaisons techniques ou de finition qu'un commercial propose au client pour un même produit.
- Clé Étrangère (productId) : Elle pointe directement sur l'identifiant id de la table Product.
- Liaison SQL (ON DELETE CASCADE) : Si un administrateur supprime le produit "Flyers" (Product), Prisma détruit automatiquement toutes ses variantes associées dans ProductVariant pour éviter les données orphelines.

## C. La Table PricingRule (Les Feuilles / L'Intelligence)

- Rôle : Elle stocke le moteur de calcul (pricingMode) et la grille tarifaire complète encryptée en un unique objet Json (config).
- Clé Étrangère (variantId) : Elle est liée à l'identifiant id de la table ProductVariant. Elle est typée en Int pour correspondre parfaitement à sa clé parente.
- Indexation (@@index([variantId])) : Une table SQL cherche ligne par ligne de haut en bas. L'index demande à PostgreSQL de trier à l'avance les règles par variante. Résultat : la recherche d'un prix par le POS du commercial prend moins d'une milliseconde. [1]

---

## 🎨 PARTIE 2 : TRADUCTION MÉTIER DES PRODUITS DANS LA BASE

Voici la cartographie exacte de la manière dont vos produits réels, leurs variantes et leurs tarifs en Ariary (MGA) sont interprétés par le système à travers le champ Json config.

## 1. Le Groupe "Mesures & Grand Format" (Gâche technique forcée à 1,5m)

Pour ce groupe, le frontend reçoit une instruction de calcul géométrique. Le client donne sa mesure désirée, mais le système calcule et facture la matière réellement consommée sur le rouleau de l'atelier.

## 🔹 Produit A : Vinyle Autocollant (slug: "vinyle-autocollant")

- Variante 1 : Prédécoupé
- pricingMode : COMPOSITE (Mélange de deux logiques)
  - config (Json) : {"per_m2": 22000, "A4": 2500}
  - Logique POS : Si le commercial sélectionne l'option au mètre carré, l'algorithme applique 22 000 Ar par $m^2$ basé sur la laize de 1,5m. S'il saisit une commande de feuilles de stickers au format A4, le système extrait la clé "A4" pour appliquer le forfait de 2 500 Ar.
- Variante 2 : Sans Découpe
- pricingMode : PER_M2
  - config (Json) : {"per_m2": 18000}
  - Logique POS : Pas de découpe complexe à la forme, la machine imprime et coupe le rouleau droit. Le prix brut de 18 000 Ar est appliqué à la surface brute consommée ($1,5m \times \text{Longueur}$).

## 🔹 Produit B : Bâche & Dos Bleu (slug: "bache-dos-bleu")

- Variante 1 : Standard
- pricingMode : PER_M2
  - config (Json) : {"per_m2": 18000}
  - Logique POS : Identique au vinyle brut. Facturation forcée à la largeur du rouleau (1,5m) multipliée par la longueur demandée par le client.

---

## 2. Le Groupe "Impression Numérique Standard" (Formats fixes & Recto/Verso)

Pour ce groupe, l'interface utilisateur n'affiche aucune case de saisie de dimensions sur-mesure (cm). Elle propose un choix strict de boutons (A4, A3, etc.).

## 🔹 Produit C : Panneau PVC (slug: "panneau-pvc")

- Variante 1 : Standard
- pricingMode : FORMAT
  - config (Json) : {"A4": 10000, "A3": 15000, "A2": 22000, "A1": 40000, "max": 72000}
  - Logique POS : Le commercial coche la case "A3", le front intercepte l'événement, ouvre le JSON, lit la clé "A3" et renvoie instantanément 15 000 Ar.

## 🔹 Produit D : Papier Autocollant (slug: "papier-autocollant")

- Variante 1 : Standard
- pricingMode : FORMAT
  - config (Json) : {"A4": 2000}
  - Logique POS : Prix forfaitaire fixe par feuille A4.

## 🔹 Produit E : Flyers (slug: "flyers")

- Variante 1 : Recto
- pricingMode : RECTO_VERSO
  - config (Json) : {"A4": 1200, "A3": 2400}
- Variante 2 : Recto Verso
- pricingMode : RECTO_VERSO
  - config (Json) : {"A4": 1800, "A3": 3600}
  - Logique POS : Le choix de la face se fait par la sélection de la variante elle-même. Une fois la variante choisie (ex: Recto Verso), l'application filtre le format (ex: A4) pour obtenir le prix unitaire de la feuille (1 800 Ar).

---

## 3. Le Groupe "Objets, Textile & Signalétique" (Forfaits fixes & Unités)## 🔹 Produit F : Carte de Visite (slug: "carte-de-visite")

- Variante 1 : Recto Seul $\rightarrow$ pricingMode: PER_UNIT $\rightarrow$ config: {"unit": 150}
- Variante 2 : Recto Verso $\rightarrow$ pricingMode: PER_UNIT $\rightarrow$ config: {"unit": 300}
- Logique POS : Le prix est à la pièce unitaire. Le commercial saisit la quantité (ex: 200 pièces) et le système multiplie directement par la valeur de la clé "unit".

## 🔹 Produit G : Rollup (slug: "rollup")

- Variante 1 : Standard $\rightarrow$ pricingMode: FIXED $\rightarrow$ config: {"unit": 210000}
- Variante 2 : Deluxe $\rightarrow$ pricingMode: FIXED $\rightarrow$ config: {"unit": 270000}

## 🔹 Produit H : Oriflamme / Drapeau (slug: "oriflamme")

- Variante 1 : Standard
- pricingMode : FIXED
  - config (Json) : {"2.8m": 200000, "3.5m": 240000, "4.5m": 300000}
  - Logique POS : Trié par la hauteur de la structure du drapeau.

## 🔹 Produit I : Métrage DTF (slug: "metrage-dtf")

- Variante 1 : Standard $\rightarrow$ pricingMode: FORMAT $\rightarrow$ config: {"A4": 10000, "1m\*60cm": 22000}

## 🔹 Produit J : T-Shirt & Polo Personnalisé (slug: "t-shirt-personnalise", "polo-personnalise")

- Variantes : "Marquage DTF" ou "Marquage Flex" $\rightarrow$ pricingMode: FIXED $\rightarrow$ Contient le forfait unitaire de la pièce textile finie textile incluse (ex: 21000, 28000, 38000).

## 🔹 Produit K : Mug Souvenir (slug: "mug-souvenir")

- Variante 1 : Standard $\rightarrow$ pricingMode: FIXED $\rightarrow$ config: {"unit": 14000}

---

## 💻 PARTIE 3 : MANUEL D'UTILISATION POUR LE CODEUR (FLUX REQUÊTE)

Lorsqu'un commercial manipule l'interface du point de vente (POS) pour créer une ligne de commande, le code doit suivre précisément cette cinématique pour calculer le prix de manière infaillible et sécurisée.

## 🔄 Le Cheminement Algorithmique Idéal (Du Front au Back)

1.  L'Étape de Sélection (Front) :

- Le commercial clique sur un produit (ex: "Vinyle Autocollant" $\rightarrow$ Prédécoupé).
  - L'application retient l'ID de la variante sélectionnée (variantId).

2.  La Capture des Variables Métiers (Front) :

- Scénario Grand Format : Le commercial tape la largeur en cm (widthCm = 100) et la hauteur en cm (heightCm = 350).
  - Scénario Format Fixe : Le commercial sélectionne une valeur dans un menu déroulant (ex: "A3").

3.  L'exécution de la Gâche Machine (Front pour l'affichage en direct) :

- Si le produit est du Grand Format (PER_M2), le code Javascript applique instantanément la règle de la laize de 1,5m apprise au début de l'analyse :
  $$\text{Longueur en mètres} = \frac{\max(\text{widthCm}, \text{heightCm})}{100} = \frac{350}{100} = 3,5m$$
  $$\text{Surface Facturée} = 1,5m \times 3,5m = 5,25m^2$$
  - Le Front cherche dans le JSON config la valeur de "per_m2" (22000).
  - Il multiplie : $5,25 \times 22000 = 115\ 500\text{ Ar}$ (Prix unitaire de la ligne).

4.  La Sécurisation Finale (Le Passage dans le Backend) :

- Le commercial valide la commande. Le Frontend envoie la payload HTTP suivante à l'API :
  {
  "variantId": 1,
  "pricingRuleId": 1,
  "quantity": 2,
  "widthCm": 100,
  "heightCm": 350,
  "unitPrice": 115500,
  "totalPrice": 231000
  }
  - Sécurité Anti-Fraude Obligatoire : Dans le OrderService du backend, le serveur va intercepter cette requête. Il re-cherche la règle de prix en BDD via Prisma, re-calcule de son côté la gâche à 1,5m, et vérifie que le résultat concorde parfaitement avec le unitPrice soumis par le client pour interdire toute modification manuelle malveillante des prix depuis l'inspecteur du navigateur frontend.

---

## 💡 Recommandation pour la maintenance future du catalogue

Ce manuel démontre la scalabilité de votre architecture. Si, dans 6 mois, vous décidez d'ajouter un produit "Impression sur Bâche Rétroéclairée (Backlit)", la procédure prendra 30 secondes :

1.  Aucun code ne sera modifié.
2.  Vous ajouterez simplement une ligne dans votre table Product et une règle avec son dictionnaire de prix en JSON. L'application l'ingérera instantanément.

---

Ce document constitue la feuille de route définitive de la gestion des prix et des produits de votre ERP.
Souhaitez-vous que nous passions au point suivant, à savoir la rédaction du schéma de validation Zod de création de commande qui va devoir analyser et appliquer ces calculs de prix sécurisés ?

[1] [https://fr.scribd.com](https://fr.scribd.com/document/701437984/base-de-donnees-bac-si-1)
