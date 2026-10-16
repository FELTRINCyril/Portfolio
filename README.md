# Portfolio - Cyril Feltrin (v4, scènes 3D)

Portfolio statique bilingue FR/EN, thème clair ou sombre, couleur d'accent au choix, avec des scènes 3D
interactives (Three.js). Conçu avec Claude Design, puis développé avec Claude Code.

## Lancer en local

Le site doit être servi par un petit serveur : en double-cliquant sur `index.html`, les cartes 3D ne se
chargent pas.

```bash
python3 -m http.server 8780
# puis ouvrir http://localhost:8780
```

Le port 8780 est volontaire : le 8765 est celui de l'app Bobine (PWA), dont le service worker reste
enregistré par le navigateur pour `localhost:8765` et y afficherait Bobine à la place du portfolio.

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
  - `lib/` : copies locales de React 18.3.1, Three.js 0.160.0 (et son chargeur glTF) et du décodeur
    Meshopt, avec leurs licences MIT ;
  - `fonts/` : polices auto-hébergées (sous-ensembles latin et latin-ext), licences OFL dans
    `fonts/licences/` ;
  - `terrain/` : tuiles d'altitude figées (accueil, carte du saut, région d'Annecy) ;
  - `kreaddis-osm.json`, `iut-osm.json` : extraits OpenStreetMap des plans de quartier ;
  - photos, CV en PDF.
- `tools/fetch_terrain_tiles.py` : retélécharge les tuiles d'altitude si les lieux changent dans
  `pf3d-v4.js` (constante `SITES`).

## Aucune dépendance à un service externe

Tout ce dont la page a besoin est dans le dépôt : React, Three.js, polices et relief. Aucun visiteur n'est
envoyé vers un serveur tiers (CDN, Google Fonts, AWS), sauf Formspree au moment d'envoyer le formulaire.

- React est servi en local grâce au mécanisme prévu par le moteur Claude Design : `window.__resources`
  dans `index.html` redirige les adresses unpkg vers `assets/lib/react/`. `support.js` n'est pas modifié.
- Three.js est déclaré dans l'import map de `index.html`.
- Babel n'est pas inclus : le moteur ne le charge que pour des composants JSX, que ce site n'utilise pas.

## Crédits des données

- **Relief** : Mapzen Terrain Tiles (AWS Open Data). Sources concernées pour la Savoie et la
  Haute-Savoie : EU-DEM, produit avec des données Copernicus financées par l'Union européenne ; SRTM et
  GMTED2010, avec l'aimable autorisation de l'U.S. Geological Survey ; ETOPO1, NOAA. Liste complète des
  sources : https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- **Plans de quartier** : © contributeurs OpenStreetMap (ODbL).
- Ces mentions sont affichées en pied de page et dans les panneaux des plans.

## Formulaire de contact (Formspree)

1. Créer un formulaire sur https://formspree.io et copier son URL `https://formspree.io/f/xxxxxxx`.
2. Dans `index.html`, remplacer `https://formspree.io/f/VOTRE_ID` par cette URL.
3. Dans Formspree, ajouter le domaine du site dans "Allowed domains".
4. Les pièces jointes demandent l'offre payante de Formspree ; sans elle, le message part sans le fichier.

## Déploiement

GitHub Pages sert le site depuis la branche `main` (https://feltrincyril.github.io/Portfolio/). Cette
version vit pour l'instant sur la branche `portfolio-v4-3d` : elle n'est pas en ligne tant qu'elle n'est
pas fusionnée dans `main`.
