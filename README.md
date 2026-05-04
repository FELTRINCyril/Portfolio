# Portfolio - Cyril Feltrin

Portfolio statique (HTML/CSS/JS) au style moderne, sobre et dynamique.

## Lancer en local

Ouvre simplement `index.html` dans ton navigateur.

## Déploiement GitHub Pages (automatique)

À chaque `push` sur **`main`**, le workflow publie le site sur la branche **`gh-pages`**.

Un fichier **`.nojekyll`** à la racine évite que Jekyll traite le site (recommandé pour du HTML brut).

### 1) Créer le repo GitHub (si ce n'est pas déjà fait)

Crée un repository, puis dans ce dossier :

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin <TON_URL_GITHUB>
git push -u origin main
```

### 2) Activer GitHub Pages (à faire une fois)

Dans le repo GitHub : **Settings → Pages**.

- **Build and deployment → Source** : **Deploy from a branch**.
- **Branch** : `gh-pages` puis dossier **`/ (root)`**.
- Enregistre.

L’URL du site pour un dépôt nommé `Portfolio` est en général **`https://TON_USER.github.io/Portfolio/`** (avec le suffixe du nom du repo).

**Workflow permissions** : **Settings → Actions → General** → **Workflow permissions** : active **Read and write permissions** (sinon l'action ne peut pas pousser vers `gh-pages`).

**Si le site reste vide ou en erreur** : onglet **Actions** → ouvre le dernier run → lis le message d’erreur ; vérifie aussi que **Settings → Pages** pointe bien vers `gh-pages`.

## Personnalisation rapide

- Texte **français** : `content-fr.js`
- Texte **anglais** : `content-en.js` (traductions à maintenir à la main)
- Design : `styles.css`
- Logique (thème, carousel compétences, formulaire, etc.) : `script.js`
- **CV PDF** : fichier `assets/pdf/CV_Feltrin_Cyril.pdf` (même chemin que `hero.cv.pdfPath` dans les fichiers de contenu). GitHub Pages sert les PDF comme n’importe quel fichier statique ; pense à bien **commit** le PDF.
- **Photos centres d’intérêt** : `assets/images/interests/` (`CI_*.jpg/jpeg`, noms ASCII pour les URL).

### Liens GitHub & LinkedIn

Dans **`content-fr.js`** et **`content-en.js`**, section `hero.social`, remplace les deux URL factices :

- `https://github.com/TON_COMPTE_GITHUB` → ton profil ou dépôt
- `https://www.linkedin.com/in/TON_PROFIL_LINKEDIN/` → ton profil LinkedIn

Garde les **deux** fichiers synchronisés (même URL des deux côtés), seuls les libellés / aria-label peuvent différer.

### Langue du site

Le choix FR/EN est mémorisé dans le navigateur (`localStorage`, clé `portfolioLang`). Pas d’API de traduction : tout le texte vient des deux fichiers de contenu.

### Compétences (barres + radar)

Les deux colonnes utilisent **exactement la même liste** pour la page affichée : `sections.skills.pages[i].items` (`label`, `value` pour les deux). Tu peux ajouter ou retirer des entrées dans chaque page, ou ajouter une **nouvelle entrée dans `pages`** pour un groupe de compétences (carousel avec précédent/suivant et points).

### Notes sur les autres fonctions

- Chaque section vise au minimum une hauteur d’écran sur desktop (`min-height: 100vh`).
- Thème sombre par défaut ; bouton rond soleil/lune pour le clair.
- Contrôle FR | EN avec largeurs fixes sur les segments.

### Formulaire de contact (gratuit sur site statique / GitHub Pages)

Par défaut, si `formActionUrl` est vide dans **`content-fr.js`** et **`content-en.js`**, le formulaire ouvre un **mailto** prérempli.

Pour un envoi fiable, utilise **Formspree** (offre gratuite limitée, suffisante pour un portfolio) :

1. Créer un formulaire sur [https://formspree.io](https://formspree.io).
2. Récupérer l’URL `https://formspree.io/f/xxxxxxxx`.
3. Coller la même URL dans les deux fichiers : `sections.contact.formActionUrl`.
4. Déployer.

Alternatives gratuites possibles : **Web3Forms**, **Getform**, Google Form en iframe.
