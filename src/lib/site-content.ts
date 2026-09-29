import { db } from "@/db";
import { beautyServices, galleryItems, siteSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mediaToDto, pickVariantUrl } from "@/lib/media/resolve";
import type { MediaDto } from "@/lib/media/types";
import { PLACEHOLDER_SECTION } from "@/lib/media/placeholders";

export type ServiceBlock = {
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  media: MediaDto | null;
  imageUrl: string | null;
};

export type ShopCategoryTeaser = {
  key: string;
  title: string;
  icon: string;
  media: MediaDto | null;
  imageUrl: string | null;
};

const SHOP_CATEGORIES: { key: string; title: string; icon: string }[] = [
  { key: "shop_category_sacs", title: "Sacs", icon: "👜" },
  { key: "shop_category_pagne", title: "Sacs en pagne", icon: "🛍️" },
  { key: "shop_category_perles", title: "Perles", icon: "📿" },
  { key: "shop_category_creations", title: "Créations perles", icon: "💎" },
  { key: "shop_category_eventails", title: "Éventails", icon: "🪭" },
  { key: "shop_category_cadeaux", title: "Cadeaux", icon: "🎁" },
];

async function sectionMedia(sectionKey: string): Promise<MediaDto | null> {
  const row = await db.query.siteSections.findFirst({
    where: eq(siteSections.sectionKey, sectionKey),
    with: { media: true },
  });
  return row?.media ? mediaToDto(row.media) : null;
}

export async function getHeroContent() {
  const media = await sectionMedia("hero_main");
  return {
    media,
    imageUrl: pickVariantUrl(media, "xl") ?? PLACEHOLDER_SECTION,
  };
}

export async function getBookingBannerContent() {
  const media = await sectionMedia("booking_banner");
  return {
    media,
    imageUrl: pickVariantUrl(media, "lg") ?? PLACEHOLDER_SECTION,
  };
}

export async function getBeautyServices(): Promise<ServiceBlock[]> {
  const rows = (
    await db.query.beautyServices.findMany({
      where: eq(beautyServices.isActive, 1),
      with: { media: true },
    })
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return rows.map((s) => {
    const dto = s.media ? mediaToDto(s.media) : null;
    return {
      slug: s.slug,
      title: s.title,
      description: s.description,
      icon: s.icon,
      media: dto,
      imageUrl: pickVariantUrl(dto, "md") ?? PLACEHOLDER_SECTION,
    };
  });
}

export async function getShopCategoryTeasers(): Promise<ShopCategoryTeaser[]> {
  const out: ShopCategoryTeaser[] = [];
  for (const cat of SHOP_CATEGORIES) {
    const dto = await sectionMedia(cat.key);
    out.push({
      key: cat.key,
      title: cat.title,
      icon: cat.icon,
      media: dto,
      imageUrl: pickVariantUrl(dto, "md") ?? PLACEHOLDER_SECTION,
    });
  }
  return out;
}

export async function getGalleryForHome(limit = 6) {
  const rows = (
    await db.query.galleryItems.findMany({
      where: eq(galleryItems.isActive, 1),
      with: { media: true },
    })
  )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
  return rows.map((g) => {
    const dto = g.media ? mediaToDto(g.media) : null;
    return {
      caption: g.caption,
      media: dto,
      imageUrl: pickVariantUrl(dto, "md"),
    };
  });
}
