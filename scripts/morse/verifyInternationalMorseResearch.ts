import { validateInternationalMorseResearch } from "./internationalMorseResearch.ts";
import { INTERNATIONAL_MORSE_RESEARCH_IMPORT } from "./internationalMorseResearchData.ts";

const analysis = validateInternationalMorseResearch(INTERNATIONAL_MORSE_RESEARCH_IMPORT);
console.log(`International Morse research verification: systems=${analysis.summary.systems} sources=${analysis.summary.sources} claims=${analysis.summary.claims} candidates=${analysis.summary.candidates} recommendations=${analysis.summary.recommendations} conflicts=${analysis.summary.conflicting} approved=${analysis.summary.approved} pendingHumanReview=${analysis.summary.candidates - analysis.summary.approved} vectors=${analysis.testVectors.length}`);
