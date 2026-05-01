import FaqSectionGeneric, {
  type FaqItem,
} from "~/client/components/shared/FaqSectionGeneric";

export const items: FaqItem[] = [
  {
    q: "What makes this different from the translator?",
    a: "The translator converts anything you paste in. Practice mode gives you one prompt at a time and checks your answer, so you can drill and repeat without a full conversion UI.",
  },
  {
    q: "Do I need perfect spacing when I type Morse?",
    a: "No. Practice mode accepts common spacing styles and normalizes your input before checking. A single space between letters is fine.",
  },
  {
    q: "What does Mixed mode do?",
    a: "Mixed alternates between Text to Morse and Morse to Text prompts so you practice both directions.",
  },
  {
    q: "How is accuracy calculated?",
    a: "Accuracy is correct answers divided by attempts, shown as a percentage. Streak counts consecutive correct answers.",
  },
  {
    q: "How many questions are in a run?",
    a: "A run is always 10 questions. Your progress shows Questions X/10 until you finish the run.",
  },
  {
    q: "What happens if I skip a question?",
    a: "Skip advances to the next prompt without marking the current one correct, and it breaks your streak for this run.",
  },
  {
    q: "Can I share my results?",
    a: "Yes. Share copies a compact summary of your run progress and stats so you can paste it anywhere.",
  },
];

export default function PracticeFaq() {
  return <FaqSectionGeneric title="Practice FAQ" items={items} />;
}
