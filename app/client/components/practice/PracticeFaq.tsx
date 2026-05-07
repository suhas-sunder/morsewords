import FaqSectionGeneric, {
  type FaqItem,
} from "~/client/components/shared/FaqSectionGeneric";

export const items: FaqItem[] = [
  {
    q: "What should I practice first on this page?",
    a: "Start with letters if you are new, then add numbers, signals, words, and sentences as recall gets steadier. Mixed mode is best after both directions feel familiar.",
  },
  {
    q: "Is Morse code practice scored here?",
    a: "Yes. Each run checks answers, tracks attempts, accuracy, streak, and progress, then lets you restart for another focused practice round.",
  },
  {
    q: "Should I use practice mode or a quiz?",
    a: "Use this page for broad drill work and quick feedback. Use audio quiz or visual quiz when you specifically want a test-like session for listening or visual recognition.",
  },
  {
    q: "How often should I practice Morse code?",
    a: "Short daily sessions usually work better than occasional long sessions. Ten focused questions are enough to reveal which characters or words need review.",
  },
  {
    q: "Which tool should I use after general practice?",
    a: "Move to typing practice for keyboard recall, audio practice for listening, visual practice for dot-dash recognition, or the word trainer for repeated weak words.",
  },
];

export default function PracticeFaq() {
  return <FaqSectionGeneric title="Practice FAQ" items={items} />;
}
