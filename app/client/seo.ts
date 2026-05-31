import { SITE_ORIGIN, absoluteUrl } from "~/client/data/routes";

export const SITE_URL = SITE_ORIGIN;

type SeoMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  robots?: string;
};

export function canonicalUrl(path: string) {
  return absoluteUrl(path);
}

export function seoMeta({
  title,
  description,
  path,
  keywords,
  robots = "index,follow",
}: SeoMetaInput) {
  const url = canonicalUrl(path);
  const tags: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
  ];

  if (keywords) tags.push({ name: "keywords", content: keywords });

  tags.push(
    { name: "robots", content: robots },
    { name: "theme-color", content: "#0b2447" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "MorseWords" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  );

  return tags;
}
