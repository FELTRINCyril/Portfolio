# Portfolio - Cyril Feltrin

Portfolio statique (HTML / CSS / JavaScript vanilla), bilingue FR/EN, thème sombre/clair,
design "dev premium" en violet, déployé automatiquement sur GitHub Pages.

## Lancer en local

Ouvre `index.html` dans ton navigateur. (Si un navigateur bloque quelque chose en `file://`,
sers le dossier avec `python3 -m http.server` puis ouvre `http://localhost:8000`.)

## Modifier le contenu : un seul fichier

Tout le contenu du site vit dans **`data.js`**. C'est la seule source à éditer.

Principe : la structure est écrite **une seule fois**. Seul le texte à traduire est un objet
`{ fr: "...", en: "..." }`. Le reste (URLs, images, dates, valeurs %, tags) est écrit une fois.

- Ajouter une expérience / un projet / une compétence : copier un bloc existant dans la liste
  correspondante et adapter.
- Une traduction manquante saute aux yeux : `fr` et `en` sont côte à côte.
- L'**âge** est calculé automatiquement depuis `identity.birthdate` (le token `{age}` est remplacé).
- Le **hero** : `home.titles` = les titres qui défilent (type animation) ; `home.stats` = les
  chiffres animés ; `home.status` = la pastille verte.

Fichiers :

- `data.js` : **contenu** (FR + EN), la seule chose à éditer au quotidien.
- `styles.css` : design (design system par variables CSS).
- `script.js` : logique (rendu, langue, thème, type animation, compteurs, radar, particules, formulaire).
- `assets/` : images (`.webp`) et CV PDF (voir `assets/README.md`).

## Thème et couleur

- Thème **sombre par défaut**, bouton bascule (switch) pour le clair (`localStorage`, clé `theme`).
- Langue FR/EN mémorisée (`localStorage`, clé `portfolioLang`).
- **Couleur d'accent** : centralisée dans le bloc de tokens en haut de `styles.css`
  (`--g1`, `--g2`, `--g3`, `--accent`). Changer ces variables change toute l'identité couleur
  (dégradés des titres, boutons, badges, radar, orbs de fond).

## Compétences (barres + radar)

Barres (groupées par catégorie) et radar (toutes les compétences) sont générés depuis
`sections.skills.categories`. Modifier une valeur `value` (0-100) met à jour les deux.

## Formulaire de contact

Par défaut (`sections.contact.formActionUrl` vide), le formulaire ouvre un **mailto** prérempli.
Pour un envoi réel sans serveur, utiliser **Formspree** (offre gratuite) :

1. Créer un formulaire sur https://formspree.io
2. Récupérer l'URL `https://formspree.io/f/xxxxxxxx`
3. La coller dans `sections.contact.formActionUrl` (dans `data.js`)
4. Déployer.

## Déploiement GitHub Pages (automatique)

À chaque `push` sur **`main`**, le workflow (`.github/workflows/deploy.yml`) publie le site sur la
branche **`gh-pages`**. Un fichier `.nojekyll` évite le traitement Jekyll.

Activation (une fois) : **Settings -> Pages -> Deploy from a branch -> `gh-pages` / `(root)`**.
URL du site : `https://FELTRINCyril.github.io/Portfolio/`.

## Sauvegardes

- `backup-old-portfolio` : tout premier portfolio.
- `backup-v2-editorial` : version "éditorial épuré" (clair).
- `main` : version actuelle (dev premium violet).
