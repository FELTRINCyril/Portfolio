# Portfolio - Cyril Feltrin

Portfolio statique (HTML / CSS / JavaScript vanilla), bilingue FR/EN, thème clair/sombre,
déployé automatiquement sur GitHub Pages.

## Lancer en local

Ouvre `index.html` dans ton navigateur. (Les images/CV se chargent via des chemins relatifs ;
si un navigateur bloque quelque chose en `file://`, sers le dossier avec
`python3 -m http.server` puis ouvre `http://localhost:8000`.)

## Modifier le contenu : un seul fichier

Tout le contenu du site vit dans **`data.js`**. C'est la seule source à éditer.

Principe : la structure est écrite **une seule fois**. Seul le texte à traduire est un objet
`{ fr: "...", en: "..." }`. Le reste (URLs, images, dates, valeurs %) est écrit une fois.

```js
skills: {
  categories: [
    { label: { fr: "ERP", en: "ERP" },
      items: [ { label: "Odoo", value: 70 } ] }
  ]
}
```

- Ajouter une expérience / un projet / une compétence : copier un bloc existant dans la liste
  correspondante et adapter.
- Une traduction manquante saute aux yeux : `fr` et `en` sont côte à côte.
- L'**âge** est calculé automatiquement depuis `identity.birthdate` (rien à mettre à jour).
- Le token `{age}` dans un texte est remplacé par l'âge calculé.

Fichiers :

- `data.js` : **contenu** (FR + EN), la seule chose à éditer au quotidien.
- `styles.css` : design (design system par variables CSS).
- `script.js` : logique (rendu depuis `data.js`, langue, thème, radar, formulaire).
- `assets/` : images (`.webp`) et CV PDF (voir `assets/README.md`).

## Langue

Le choix FR/EN est mémorisé dans le navigateur (`localStorage`, clé `portfolioLang`).
Pas d'API : tout le texte vient de `data.js`.

## Thème et couleur d'accent

- Thème clair par défaut, bouton lune/soleil pour le sombre (`localStorage`, clé `theme`).
- Couleur d'accent gérée par une seule variable CSS `--accent` (bloc `ACCENT` dans `styles.css`).
- **Bouton « Test couleur »** (temporaire) : bascule l'accent slate <-> violet pour comparer le
  rendu. Pour figer une couleur définitivement et retirer ce test :
  1. supprimer le bouton `#accent-test` dans `index.html`,
  2. supprimer le listener `accent-test` et l'entrée `accentTest` (dans `script.js` / `data.js`),
  3. dans `styles.css`, ne garder que la palette voulue dans le bloc `ACCENT`.

## Compétences (barres + radar)

Les barres (à gauche, groupées par catégorie) et le radar (à droite, toutes les compétences)
sont générés à partir de `sections.skills.categories` dans `data.js`. Modifier une valeur `value`
(0-100) met à jour les deux.

## Formulaire de contact

Par défaut (`sections.contact.formActionUrl` vide), le formulaire ouvre un **mailto** prérempli.
Pour un envoi fiable sans serveur, utilise **Formspree** (offre gratuite) :

1. Créer un formulaire sur https://formspree.io
2. Récupérer l'URL `https://formspree.io/f/xxxxxxxx`
3. La coller dans `sections.contact.formActionUrl` (dans `data.js`)
4. Déployer.

## Déploiement GitHub Pages (automatique)

À chaque `push` sur **`main`**, le workflow (`.github/workflows/deploy.yml`) publie le site sur la
branche **`gh-pages`**. Un fichier `.nojekyll` évite le traitement Jekyll.

Activation (une fois) : **Settings -> Pages -> Deploy from a branch -> `gh-pages` / `(root)`**.
Vérifier aussi **Settings -> Actions -> General -> Workflow permissions -> Read and write**.

URL du site : `https://FELTRINCyril.github.io/Portfolio/`.

## Sauvegarde

L'ancienne version du portfolio est conservée sur la branche **`backup-old-portfolio`**.
