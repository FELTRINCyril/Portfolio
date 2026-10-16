"""Telecharge les tuiles d'altitude Terrarium utilisees par pf3d-v4.js dans assets/terrain/.

Le relief est fige dans le site pour ne pas dependre du serveur AWS. A relancer seulement si les
coordonnees de SITES changent dans pf3d-v4.js (garder les deux listes synchronisees) :

    python3 tools/fetch_terrain_tiles.py

Source : Mapzen Terrain Tiles sur AWS Open Data (attribution : voir README.md).
"""
import math
import pathlib
import urllib.request

# Meme contenu que SITES dans pf3d-v4.js : (cle, latitude, longitude, zoom)
SITES = [
    ("lflb", 45.6381, 5.8803, 11),  # aerodrome de Chambery - Aix-les-Bains (accueil + carte du saut)
    ("kre", 45.878, 6.108, 12),     # region d'Annecy (onglet Region de Kreaddis)
]
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "terrain"


def tile(lat, lon, z):
    """Meme formule que tileF() dans pf3d-v4.js."""
    n, lr = 2 ** z, math.radians(lat)
    return int((lon + 180) / 360 * n), int((1 - math.log(math.tan(lr) + 1 / math.cos(lr)) / math.pi) / 2 * n)


for key, lat, lon, z in SITES:
    tx, ty = tile(lat, lon, z)
    for dy in (-1, 0, 1):          # loadDEM() assemble une grille 3 x 3 autour de la tuile centrale
        for dx in (-1, 0, 1):
            x, y = tx + dx, ty + dy
            dest = OUT / str(z) / str(x) / f"{y}.png"
            dest.parent.mkdir(parents=True, exist_ok=True)
            with urllib.request.urlopen(URL.format(z=z, x=x, y=y)) as r:
                dest.write_bytes(r.read())
            print(key, dest.relative_to(OUT.parent.parent), dest.stat().st_size)
