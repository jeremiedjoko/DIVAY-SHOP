import Image from "next/image";
import type { ImageVariant } from "@/lib/media/constants";
import { focalStyle, pickVariantUrl } from "@/lib/media/resolve";
import type { MediaDto } from "@/lib/media/types";

type Props = {
  media: MediaDto | null | undefined;
  fallbackSrc?: string;
  alt: string;
  variant?: ImageVariant;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

export function ResponsiveMedia({
  media,
  fallbackSrc,
  alt,
  variant = "lg",
  className = "",
  fill,
  width,
  height,
  priority,
  sizes,
}: Props) {
  const src = pickVariantUrl(media, variant) ?? fallbackSrc;
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-200 text-xs text-stone-500 ${className}`}
        aria-hidden
      >
        Image à définir dans l&apos;admin
      </div>
    );
  }

  const style = media ? focalStyle(media.focalX, media.focalY) : undefined;
  const resolvedAlt = media?.altText?.trim() || alt;

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        className={`object-cover ${className}`}
        style={style}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={width ?? 800}
      height={height ?? 600}
      className={`object-cover ${className}`}
      style={style}
      priority={priority}
      sizes={sizes}
    />
  );
}
