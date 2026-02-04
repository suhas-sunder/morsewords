export type FaqItem = {
  q: string;
  a: string;
};

export default function FaqSection() {
  const title = "MorseWords FAQ";
  const items = [
    {
      q: "What speed should I start with?",
      a: "Begin around 15 to 20 WPM, then raise speed as accuracy improves.",
    },
    {
      q: "Does punctuation work?",
      a: "Yes. Period, comma, question mark, slash, quotes, hyphen, plus, equals, and more are supported.",
    },
    {
      q: "Can I listen without converting?",
      a: "Yes. Paste Morse and use audio playback at your chosen WPM and tone.",
    },
    {
      q: "Why are spaces required?",
      a: "Spacing separates symbols and words so the translator can decode correctly. Use three spaces between letters and seven between words.",
    },
    {
      q: "Do I need audio to practice learning Morse Code?",
      a: "No. You can decode by reading the code or by listening.",
    },
    {
      q: "How long is each round?",
      a: "Rounds are short so you can practice daily without fatigue.",
    },
    {
      q: "What should I focus on first?",
      a: "Focus on recognition and spacing. Speed will follow naturally.",
    },
    {
      q: "Is this good for beginners?",
      a: "Yes. The Interactive Learning Interface starts simple and grows with your skill.",
    },
  ];
  return (
    <section style={{ marginBottom: "3rem" }} aria-labelledby="faq-title" className="bg-white p-6 rounded-xl shadow-sm">
      <h2 id="faq-title" style={{ color: "#0b2447" }} className="text-xl">
        {title}
      </h2>

      <div className="flex flex-col gap-5 my-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((faq, i) => (
          <div
            key={i}
            className="bg-white border border-[#e6e8ef] rounded-xl p-5 h-full"
          >
            <div className="text-neutral-900 font-bold text-lg leading-snug">
              {faq.q}
            </div>
            <p className="text-[#555] mt-3 mb-0 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
