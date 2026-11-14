import suitabilityData from "./morseBookSuitability.generated.json";

import { DEFAULT_PROFILE } from "./morseBookSuitabilityDisplay";
import type { MorseBookSuitabilityProfile } from "./morseBookSuitabilityDisplay";
export * from "./morseBookSuitabilityDisplay";

type SuitabilityDataFile = {
  profiles?: Record<string, MorseBookSuitabilityProfile>;
};

const profileBySlug = (suitabilityData as SuitabilityDataFile).profiles ?? {};

export function getMorseBookSuitability(
  slug: string,
): MorseBookSuitabilityProfile {
  return profileBySlug[slug] ?? DEFAULT_PROFILE;
}

export function shouldShowInLowerRiskBookFilter(slug: string) {
  const profile = getMorseBookSuitability(slug);
  return profile.contentSuitability !== "elevated" && !profile.strictReviewCandidate;
}
