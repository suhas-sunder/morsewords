import type { BookMetadata, BookRightsBasis } from "./bookManifestTypes.ts";

const PUBLISH_READY_RIGHTS = new Set<BookRightsBasis>([
  "public-domain-us",
  "public-domain",
  "licensed",
  "permission-granted",
]);

export type RightsValidationResult = {
  publishReady: boolean;
  warnings: string[];
};

export function validateBookRights(
  metadata: BookMetadata,
): RightsValidationResult {
  const warnings: string[] = [];

  if (!metadata.source.gutenbergId) {
    warnings.push("Missing Project Gutenberg ID.");
  }

  if (!metadata.source.rightsReviewed) {
    warnings.push("Rights have not been reviewed; generated book is not publish-ready.");
  }

  if (!PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis)) {
    warnings.push(`Rights basis "${metadata.source.rightsBasis}" is not publish-ready.`);
  }

  return {
    publishReady:
      metadata.source.rightsReviewed &&
      PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis),
    warnings,
  };
}
