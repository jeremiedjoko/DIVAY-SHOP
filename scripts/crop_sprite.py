"""
Script de découpe du sprite sheet Divay Beauty
Image source : 1024 x 935 px
"""
from PIL import Image
import os

SRC = r'C:/Users/HP/.gemini/antigravity/brain/20785869-a102-404f-b4ef-5bf05da4d27b/.user_uploaded/media_1790608636303.jpg'
BASE = r'C:/Users/HP/boutique-moderne/public/images/divay-beauty'

img = Image.open(SRC)
W, H = img.size
print(f"Image source : {W} x {H}")

# ── Coordonnées estimées visuellement (left, upper, right, lower) ──────────────
# Chaque section commence après un badge + label de chemin.
# Les images ont de petits rebords blancs entre elles.

crops = {
    # ── HERO ──────────────────────────────────────────────────────────────────
    "hero/hero-beaute.jpg":        (12,  38,  345, 188),
    "hero/hero-soins.jpg":         (358, 38,  820, 188),

    # ── PRESTATIONS ──────────────────────────────────────────────────────────
    "prestations/makeup.jpg":      (12,  220, 200, 390),
    "prestations/manucure.jpg":    (210, 220, 400, 390),
    "prestations/pedicure.jpg":    (410, 220, 598, 390),
    "prestations/soins-visage.jpg":(608, 220, 798, 390),
    "prestations/bien-etre.jpg":   (808, 220, 998, 390),

    # ── BOUTIQUE ─────────────────────────────────────────────────────────────
    "boutique/sac-pagne.jpg":      (12,  430, 200, 565),
    "boutique/pochette-perlee.jpg":(210, 430, 400, 565),
    "boutique/eventail.jpg":       (410, 430, 598, 565),
    "boutique/perles.jpg":         (608, 430, 798, 565),
    "boutique/papeterie.jpg":      (808, 430, 998, 565),

    # ── GALERIE ──────────────────────────────────────────────────────────────
    "galerie/galerie-01.jpg":      (12,  605, 172, 730),
    "galerie/galerie-02.jpg":      (180, 605, 340, 730),
    "galerie/galerie-03.jpg":      (348, 605, 508, 730),
    "galerie/galerie-04.jpg":      (516, 605, 676, 730),
    "galerie/galerie-05.jpg":      (684, 605, 844, 730),
    "galerie/galerie-06.jpg":      (852, 605, 1012, 730),

    # ── TESTIMONIALS ─────────────────────────────────────────────────────────
    "testimonials/cliente-01.jpg": (12,  780, 220, 930),
    "testimonials/cliente-02.jpg": (228, 780, 436, 930),
    "testimonials/cliente-03.jpg": (444, 780, 652, 930),
}

saved = []
for rel_path, box in crops.items():
    out_path = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    cropped = img.crop(box)
    cropped.save(out_path, quality=92)
    saved.append((rel_path, cropped.size))
    print(f"  ✓ {rel_path}  ({cropped.size[0]}x{cropped.size[1]})")

print(f"\n✅ {len(saved)} images extraites dans {BASE}")
