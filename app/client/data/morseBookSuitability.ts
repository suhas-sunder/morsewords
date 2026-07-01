import suitabilityData from "./morseBookSuitability.generated.json";

export type MorseBookContentSuitability = "low" | "moderate" | "elevated";

export type MorseBookSuitabilityProfile = {
  contentSuitability: MorseBookContentSuitability;
  strictReviewCandidate: boolean;
  contentNote: string;
};

const DEFAULT_PROFILE: MorseBookSuitabilityProfile = {
  contentSuitability: "moderate",
  strictReviewCandidate: true,
  contentNote:
    "Historical public-domain text. May include period language, mature themes, or intense scenes. Review before classroom or younger-user use.",
};

type SuitabilityDataFile = {
  profiles?: Record<string, MorseBookSuitabilityProfile>;
};

const profileBySlug = (suitabilityData as SuitabilityDataFile).profiles ?? {};

export function getMorseBookSuitability(
  slug: string,
): MorseBookSuitabilityProfile {
  return profileBySlug[slug] ?? DEFAULT_PROFILE;
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

export function shouldShowInLowerRiskBookFilter(slug: string) {
  const profile = getMorseBookSuitability(slug);
  return profile.contentSuitability !== "elevated" && !profile.strictReviewCandidate;
}
