import os
import glob

mapping = {
    "/images/divay-beauty/hero/hero-beaute.jpg": "/bank/OIP (2).webp",
    "/images/divay-beauty/hero/hero-soins.jpg": "/bank/OIP (1).webp",
    "/images/divay-beauty/prestations/makeup.jpg": "/bank/pexels-eyeboll-studios-3088642-4684193.jpg",
    "/images/divay-beauty/prestations/manucure.jpg": "/bank/pexels-rdne-7755287.jpg",
    "/images/divay-beauty/prestations/pedicure.jpg": "/bank/OIP.webp",
    "/images/divay-beauty/prestations/soins-visage.jpg": "/bank/596f4bbc50080-soins-visage-african-lady-togo.jpg",
    "/images/divay-beauty/prestations/bien-etre.jpg": "/bank/pexels-sora-shimazaki-5938278.jpg",
    "/images/divay-beauty/galerie/galerie-01.jpg": "/bank/pexels-el-gringo-photo-116752370-16052873.jpg",
    "/images/divay-beauty/galerie/galerie-02.jpg": "/bank/pexels-babajide-olusanya-2151643024-36331023.jpg",
    "/images/divay-beauty/galerie/galerie-03.jpg": "/bank/pexels-darksight-image-736222078-36537457.jpg",
    "/images/divay-beauty/galerie/galerie-04.jpg": "/bank/pexels-thekehindeogunsanya-11515392.jpg",
    "/images/divay-beauty/galerie/galerie-05.jpg": "/bank/pexels-darkshadephotos-39287202.jpg",
    "/images/divay-beauty/galerie/galerie-06.jpg": "/bank/OIP (3).webp",
    "/images/divay-beauty/testimonials/cliente-01.jpg": "/bank/pexels-el-gringo-photo-116752370-30412203.jpg",
    "/images/divay-beauty/testimonials/cliente-02.jpg": "/bank/pexels-el-gringo-photo-116752370-30412204.jpg",
    "/images/divay-beauty/testimonials/cliente-03.jpg": "/bank/pexels-el-gringo-photo-116752370-30412226.jpg",
}

files_to_check = glob.glob("src/app/**/*.tsx", recursive=True) + glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files_to_check:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        changed = False
        for old, new in mapping.items():
            if old in content:
                content = content.replace(old, new)
                changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")
