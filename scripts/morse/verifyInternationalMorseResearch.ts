import { validateInternationalMorseResearch } from "./internationalMorseResearch.ts";
import { INTERNATIONAL_MORSE_RESEARCH_IMPORT } from "./internationalMorseResearchData.ts";

const analysis = validateInternationalMorseResearch(INTERNATIONAL_MORSE_RESEARCH_IMPORT);
const rejected = INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.filter((decision) => decision.decision.startsWith("rejected")).length;
const productPolicy = INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.filter((decision) => decision.decision === "product-policy-decision-required").length;
console.log(`International Morse research verification: systems=${analysis.summary.systems} sources=${analysis.summary.sources} claims=${analysis.summary.claims} candidates=${analysis.summary.candidates} recommendations=${analysis.summary.recommendations} finalDecisions=${INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.length} conflicts=${analysis.summary.conflicting} approved=${analysis.summary.approved} rejected=${rejected} productPolicy=${productPolicy} vectors=${analysis.testVectors.length}`);
