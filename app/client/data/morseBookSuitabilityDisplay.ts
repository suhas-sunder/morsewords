export type MorseBookContentSuitability = "low" | "moderate" | "elevated";

export type MorseBookSuitabilityProfile = {
  contentSuitability: MorseBookContentSuitability;
  strictReviewCandidate: boolean;
  contentNote: string;
};

export const DEFAULT_PROFILE: MorseBookSuitabilityProfile = {
  contentSuitability: "moderate",
  strictReviewCandidate: true,
  contentNote:
    "Historical public-domain text. May include period language, mature themes, or intense scenes. Review before classroom or younger-user use.",
};

export function getMorseBookSuitabilityFromMetadata(book: Partial<MorseBookSuitabilityProfile>): MorseBookSuitabilityProfile {
  return {
    contentSuitability: book.contentSuitability ?? DEFAULT_PROFILE.contentSuitability,
    strictReviewCandidate: book.strictReviewCandidate ?? DEFAULT_PROFILE.strictReviewCandidate,
    contentNote: book.contentNote ?? DEFAULT_PROFILE.contentNote,
  };
}

export function morseBookSuitabilityLabel(
  profile: MorseBookSuitabilityProfile,
) {
  if (profile.contentSuitability === "elevated") {
    return "Elevated suitability review";
  }
  if (profile.strictReviewCandidate) {
    return "Review for younger readers";
  }
  if (profile.contentSuitability === "moderate") {
    return "Historical content note";
  }
  return "Lower-risk profile";
}
