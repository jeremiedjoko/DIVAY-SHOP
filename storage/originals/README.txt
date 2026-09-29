# Divay Beauty — stockage médias

- `public/media/{product|service|homepage|gallery}/{mediaId}/` — variantes WebP servies au site (sm, md, lg, xl, original).
- `storage/originals/{bucket}/{dossier asset}/` — fichier source téléversé (non public).

Aligné sur `Divay_Beauty_Assets` (01_HERO … 12_PLACEHOLDERS).

Ne pas coder d’URL en dur dans les composants : utiliser la table `media` + liaisons produit / section / galerie.
