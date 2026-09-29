import fs from "fs";
import path from "path";
import { ASSET_FOLDERS, MEDIA_BUCKETS } from "../src/lib/media/constants";

const root = process.cwd();

for (const bucket of MEDIA_BUCKETS) {
  fs.mkdirSync(path.join(root, "public", "media", bucket), { recursive: true });
  fs.mkdirSync(path.join(root, "storage", "originals", bucket), { recursive: true });
  for (const folder of ASSET_FOLDERS) {
    fs.mkdirSync(path.join(root, "storage", "originals", bucket, folder), { recursive: true });
  }
}

const readme = `# Divay Beauty — stockage médias

- \`public/media/{product|service|homepage|gallery}/{mediaId}/\` — variantes WebP servies au site (sm, md, lg, xl, original).
- \`storage/originals/{bucket}/{dossier asset}/\` — fichier source téléversé (non public).

Aligné sur \`Divay_Beauty_Assets\` (01_HERO … 12_PLACEHOLDERS).

Ne pas coder d’URL en dur dans les composants : utiliser la table \`media\` + liaisons produit / section / galerie.
`;

fs.mkdirSync(path.join(root, "storage", "originals"), { recursive: true });
fs.writeFileSync(path.join(root, "storage", "originals", "README.txt"), readme, "utf-8");

console.log("✅ Dossiers médias créés (public/media + storage/originals).");
