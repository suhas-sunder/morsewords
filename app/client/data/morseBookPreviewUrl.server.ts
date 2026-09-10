import { getMorseBookPreviewAssetUrl } from "./morseBookPreviews";

function netlifySiteOrigin(siteName: string | undefined) {
  const normalized = siteName?.trim();
  if (!normalized || !/^[a-z0-9][a-z0-9-]*$/i.test(normalized)) return null;
  return `https://${normalized}.netlify.app`;
}

export function getMorseBookPreviewAssetRequestUrl(
  slug: string,
  requestUrl: string,
  siteName = process.env.SITE_NAME,
) {
  return new URL(
    getMorseBookPreviewAssetUrl(slug),
    netlifySiteOrigin(siteName) ?? requestUrl,
  ).toString();
}
