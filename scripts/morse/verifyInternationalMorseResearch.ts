import { assertResearchReadyForPromotion } from "./internationalMorseResearch.ts";
import { INTERNATIONAL_MORSE_RESEARCH_IMPORT } from "./internationalMorseResearchData.ts";

const analysis = assertResearchReadyForPromotion(INTERNATIONAL_MORSE_RESEARCH_IMPORT);
console.log(`International Morse research verification: systems=${analysis.summary.systems} sources=${analysis.summary.sources} claims=${analysis.summary.claims} candidates=${analysis.summary.candidates} conflicts=${analysis.summary.conflicting} approved=${analysis.summary.approved} vectors=${analysis.testVectors.length}`);
