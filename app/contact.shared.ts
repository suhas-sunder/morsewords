export const CONTACT_CATEGORIES = [
  "general",
  "business",
  "feature",
  "bug",
  "source",
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];
