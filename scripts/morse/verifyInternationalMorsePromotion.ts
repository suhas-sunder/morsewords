import { assertResearchReadyForPromotion } from "./internationalMorseResearch.ts";
import { INTERNATIONAL_MORSE_RESEARCH_IMPORT } from "./internationalMorseResearchData.ts";

const analysis = assertResearchReadyForPromotion(INTERNATIONAL_MORSE_RESEARCH_IMPORT);
console.log(`International Morse promotion verification: candidates=${analysis.summary.candidates} approved=${analysis.summary.approved} vectors=${analysis.testVectors.length}`);
