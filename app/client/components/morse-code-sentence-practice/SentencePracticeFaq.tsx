import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import { faqItems } from "~/client/components/morse-code-sentence-practice/SentencePracticeData";

export { faqItems as items };

export default function SentencePracticeFaq() {
  return (
    <FaqSectionGeneric
      title="Morse code sentence practice FAQ"
      items={faqItems}
    />
  );
}
