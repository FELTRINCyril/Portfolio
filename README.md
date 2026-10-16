# Portfolio - Cyril Feltrin (v4, scènes 3D)

Portfolio statique bilingue FR/EN, thème clair ou sombre, couleur d'accent au choix, avec des scènes 3D
interactives (Three.js). Conçu avec Claude Design, puis développé avec Claude Code.

## Lancer en local

Le site doit être servi par un petit serveur : en double-cliquant sur `index.html`, les cartes 3D ne se
chargent pas.

```bash
python3 -m http.server 8765
# puis ouvrir http://localhost:8765
```

## Structure

- `index.html` : la page et **tous les textes**, dans deux objets en bas du fichier : `T` (libellés de
  l'interface) et `D` (parcours, projets, compétences, passions), chacun en `fr` et `en`.
- `support.js` : moteur de rendu de Claude Design (charge React et transforme les `{{ ... }}` en page).
  Fichier généré, ne pas le modifier.
- `pf3d-v4.js` : toute la 3D, sous forme de deux balises HTML :
  - `<pf-terrain>` : le relief de l'accueil (données d'altitude réelles autour de l'aérodrome de Chambéry)
    et le saut en parachute animé au défilement ;
  - `<pf-scene>` : les scènes des passions (carte du saut, parachute, moto, snowboard, musculation) et les
    plans 3D de Kreaddis et de l'IUT (données OpenStreetMap).
- `assets/` :
  - `parachute-3d.glb` : modèle du parachute (voile et sac-harnais), compressé avec glTF-Transform
    (textures WebP, géométrie Meshopt) : 2,1 Mo au lieu de 10,9 Mo, rendu identique ;
  - `lib/meshopt_decoder.module.js` : décodeur nécessaire pour lire ce modèle (meshoptimizer, licence MIT) ;
  - `kreaddis-osm.json`, `iut-osm.json` : extraits OpenStreetMap des plans de quartier ;
  - photos, CV en PDF.

## Services externes utilisés

Le site charge au démarrage :

- React, ReactDOM et Babel depuis unpkg.com (moteur de la page) ;
- Three.js et son chargeur glTF depuis unpkg.com (3D) ;
- les tuiles d'altitude Terrarium sur AWS (relief) ;
- les polices Google Fonts ;
- Formspree pour le formulaire de contact.

Si unpkg.com est indisponible, la page ne s'affiche pas.

## Formulaire de contact (Formspree)

1. Créer un formulaire sur https://formspree.io et copier son URL `https://formspree.io/f/xxxxxxx`.
2. Dans `index.html`, remplacer `https://formspree.io/f/VOTRE_ID` par cette URL.
3. Dans Formspree, ajouter le domaine du site dans "Allowed domains".
4. Les pièces jointes demandent l'offre payante de Formspree ; sans elle, le message part sans le fichier.

## Déploiement

GitHub Pages sert le site depuis la branche `main` (https://feltrincyril.github.io/Portfolio/). Cette
version vit pour l'instant sur la branche `portfolio-v4-3d` : elle n'est pas en ligne tant qu'elle n'est
pas fusionnée dans `main`.
