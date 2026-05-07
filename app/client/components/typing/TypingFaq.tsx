import FaqSectionGeneric, {
  type FaqItem,
} from "~/client/components/shared/FaqSectionGeneric";

export const items: FaqItem[] = [
  {
    q: "Is typing practice good for learning Morse?",
    a: "Typing practice is useful once you know enough patterns to enter them without looking up every character. It turns recognition into faster keyboard recall.",
  },
  {
    q: "Should I type dots and dashes or text answers?",
    a: "Use dot-dash mode when you want direct Morse entry. Use the F/J key mapping when you want keying-style muscle memory without reaching for punctuation keys.",
  },
  {
    q: "What should I focus on first, speed or accuracy?",
    a: "Accuracy comes first. A clean slow session is more useful than a fast session full of spacing errors and accidental characters.",
  },
  {
    q: "How is typing practice different from the word trainer?",
    a: "Typing practice is freeform and continuous. The word trainer gives you specific word prompts, checks answers, and turns weak words into a review list.",
  },
  {
    q: "What should I use after typing practice?",
    a: "Move to the word trainer when certain words are weak, or use audio practice when you can type visual Morse but still need listening recall.",
  },
];

export default function TypingFaq() {
  return <FaqSectionGeneric title="Typing practice FAQ" items={items} />;
}
