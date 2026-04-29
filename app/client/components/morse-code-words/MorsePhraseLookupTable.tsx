import * as React from "react";
import styles from "~/client/components/shared/pageStyles";

type Category =
  | "Common"
  | "Emergency"
  | "Prosign"
  | "Q-code"
  | "CW"
  | "Practice";

type Phrase = {
  phrase: string;
  morse: string;
  meaning: string;
  category: Category;
};

function normalizeForCopy(morse: string) {
  return morse
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function MorsePhraseLookupTable() {
  const phrases: Phrase[] = [
    // Common words
    {
      phrase: "HELLO",
      morse: ".... . .-.. .-.. ---",
      meaning: "Friendly greeting",
      category: "Common",
    },
    {
      phrase: "PLEASE",
      morse: ".--. .-.. . .- ... .",
      meaning: "Polite request",
      category: "Common",
    },
    {
      phrase: "THANK YOU",
      morse: "- .... .- -. -.- / -.-- --- ..-",
      meaning: "Expression of gratitude",
      category: "Common",
    },
    {
      phrase: "YES",
      morse: "-.-- . ...",
      meaning: "Affirmative / agreement",
      category: "Common",
    },
    {
      phrase: "NO",
      morse: "-. ---",
      meaning: "Negative / denial",
      category: "Common",
    },
    {
      phrase: "OK",
      morse: "--- -.-",
      meaning: "Confirmation / acknowledgment",
      category: "Common",
    },
    {
      phrase: "LOVE",
      morse: ".-.. --- ...- .",
      meaning: "Affection / endearment",
      category: "Common",
    },
    {
      phrase: "GOOD MORNING",
      morse: "--. --- --- -.. / -- --- .-. -. .. -. --.",
      meaning: "Polite day greeting",
      category: "Common",
    },
    {
      phrase: "GOODBYE",
      morse: "--. --- --- -.. -... -.-- .",
      meaning: "Farewell / sign-off",
      category: "Common",
    },

    // Emergency / distress
    {
      phrase: "SOS",
      morse: "... --- ...",
      meaning: "Universal distress signal",
      category: "Emergency",
    },
    {
      phrase: "MAYDAY",
      morse: "-- .- -.-- -.. .- -.--",
      meaning: "Distress call (aviation/maritime)",
      category: "Emergency",
    },
    {
      phrase: "HELP",
      morse: ".... . .-.. .--.",
      meaning: "Request for assistance",
      category: "Emergency",
    },
    {
      phrase: "NEED ASSISTANCE",
      morse: "-. . . -.. / .- ... ... .. ... - .- -. -.-. .",
      meaning: "Emergency request",
      category: "Emergency",
    },

    // Prosigns (procedure signals)
    {
      phrase: "AR (.-.-.)",
      morse: ".-.-.",
      meaning: "End of message",
      category: "Prosign",
    },
    {
      phrase: "AS (.-...)",
      morse: ".-...",
      meaning: "Wait / standby",
      category: "Prosign",
    },
    {
      phrase: "BT (-...-)",
      morse: "-...-",
      meaning: "Pause / new section",
      category: "Prosign",
    },
    {
      phrase: "CL (-.-..-..)",
      morse: "-.-..-..",
      meaning: "Going off air / closing station",
      category: "Prosign",
    },
    {
      phrase: "KN (-.-.-.)",
      morse: "-.-.-.",
      meaning: "Invitation to transmit specifically",
      category: "Prosign",
    },
    {
      phrase: "SK (...-.-)",
      morse: "...-.-",
      meaning: "End of contact / signing off",
      category: "Prosign",
    },

    // Q-codes (radio shorthand)
    {
      phrase: "QRL",
      morse: "--.- .-. .-..",
      meaning: "Is the frequency busy?",
      category: "Q-code",
    },
    {
      phrase: "QRZ",
      morse: "--.- .-. --..",
      meaning: "Who is calling me?",
      category: "Q-code",
    },
    {
      phrase: "QRS",
      morse: "--.- .-. ...",
      meaning: "Send more slowly",
      category: "Q-code",
    },
    {
      phrase: "QRQ",
      morse: "--.- .-. --.-",
      meaning: "Send faster",
      category: "Q-code",
    },
    {
      phrase: "QTH",
      morse: "--.- - ....",
      meaning: "My location is...",
      category: "Q-code",
    },
    {
      phrase: "QSL",
      morse: "--.- ... .-..",
      meaning: "Message received / acknowledgment",
      category: "Q-code",
    },
    {
      phrase: "QSY",
      morse: "--.- ... -.--",
      meaning: "Change frequency",
      category: "Q-code",
    },
    {
      phrase: "QRM",
      morse: "--.- .-. --",
      meaning: "Interference (man-made)",
      category: "Q-code",
    },
    {
      phrase: "QRN",
      morse: "--.- .-. -.",
      meaning: "Natural interference / static",
      category: "Q-code",
    },
    {
      phrase: "QRP",
      morse: "--.- .-. .--.",
      meaning: "Reduce power",
      category: "Q-code",
    },

    // Abbreviations (CW shorthand)
    {
      phrase: "73",
      morse: "--... ...--",
      meaning: "Best regards (friendly sign-off)",
      category: "CW",
    },
    {
      phrase: "88",
      morse: "---.. ---..",
      meaning: "Love and kisses (friendly end)",
      category: "CW",
    },
    {
      phrase: "OM",
      morse: "--- --",
      meaning: "Old man (friendly term for operator)",
      category: "CW",
    },
    {
      phrase: "YL",
      morse: "-.-- .-..",
      meaning: "Young lady (female operator)",
      category: "CW",
    },
    {
      phrase: "FB",
      morse: "..-. -...",
      meaning: "Fine business (good signal / message)",
      category: "CW",
    },
    {
      phrase: "TNX",
      morse: "- .... .- -. -..-",
      meaning: "Thanks",
      category: "CW",
    },
    {
      phrase: "CUL",
      morse: "-.-. ..- .-..",
      meaning: "See you later",
      category: "CW",
    },
    { phrase: "GL", morse: "--. .-..", meaning: "Good luck", category: "CW" },
    {
      phrase: "GA",
      morse: "--. .-",
      meaning: "Good afternoon",
      category: "CW",
    },
    { phrase: "GE", morse: "--. .", meaning: "Good evening", category: "CW" },
    { phrase: "GM", morse: "--. --", meaning: "Good morning", category: "CW" },

    // Practice phrases (balanced letter frequency)
    {
      phrase: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
      morse:
        "- .... . / --.- ..- .. -.-. -.- / -... .-. --- .-- -. / ..-. --- -..- / .--- ..- -- .--. ... / --- ...- . .-. / - .... . / .-.. .- --.. -.-- / -.. --- --.",
      meaning: "Pangram (uses every letter)",
      category: "Practice",
    },
    {
      phrase: "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
      morse:
        ".--. .- -.-. -.- / -- -.-- / -... --- -..- / .-- .. - .... / ..-. .. ...- . / -.. --- --.. . -. / .-.. .. --.- ..- --- .-. / .--- ..- --. ...",
      meaning: "Another pangram for practice",
      category: "Practice",
    },
    {
      phrase: "MORSE CODE IS FUN",
      morse: "-- --- .-. ... . / -.-. --- -.. . / .. ... / ..-. ..- -.",
      meaning: "Short phrase for beginners",
      category: "Practice",
    },
    {
      phrase: "KEEP PRACTICING",
      morse: "-.- . . .--. / .--. .-. .- -.-. - .. -.-. .. -. --.",
      meaning: "Encouragement to practice regularly",
      category: "Practice",
    },
    {
      phrase: "LISTEN LEARN REPEAT",
      morse: ".-.. .. ... - . -. / .-.. . .- .-. -. / .-. . .--. . .- -",
      meaning: "Training advice for beginners",
      category: "Practice",
    },
  ];

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<Category | "All">("All");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return phrases.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.phrase.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.morse.replace(/\s+/g, " ").toLowerCase().includes(q)
      );
    });
  }, [phrases, query, category]);

  async function copy(text: string, key: string) {
    const value = normalizeForCopy(text);
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((k) => (k === key ? null : k)),
        1100,
      );
    } catch {
      // No-op. If clipboard is blocked, the user can still select and copy.
    }
  }

  return (
    <section
      style={{ ...styles.card, ...styles.cardPad, marginTop: 16 }}
      aria-labelledby="morse-words-table-title"
      itemScope
      itemType="https://schema.org/Table"
    >
      <h2
        id="morse-words-table-title"
        style={{ ...styles.sectionTitle, margin: 0 }}
        className="text-sky-800 font-bold"
        itemProp="name"
      >
        Morse code words and operator shorthand (copy-ready)
      </h2>
      <p
        className="text-gray-700 text-base leading-relaxed mb-5"
        itemProp="description"
      >
        This list focuses on what people mean by “morsewords”: common everyday
        words, plus the real shorthand you see in CW practice and radio
        exchanges. Word boundaries are shown with a slash (
        <span className="font-mono">/</span>) so it stays readable when copying
        into puzzles, worksheets, or notes.
      </p>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="text-sm font-semibold text-neutral-900">
            Search
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "SOS", "QSL", or "thank"'
              className="mt-1 sm:mt-0 sm:ml-2 w-full sm:w-80 border border-gray-200 rounded-xl px-3 py-2 text-sm text-neutral-900 bg-white"
            />
          </label>

          <label className="text-sm font-semibold text-neutral-900">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "All")}
              className="mt-1 sm:mt-0 sm:ml-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-neutral-900 bg-white cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Common">Common words</option>
              <option value="Emergency">Emergency</option>
              <option value="Prosign">Prosigns</option>
              <option value="Q-code">Q-codes</option>
              <option value="CW">CW abbreviations</option>
              <option value="Practice">Practice phrases</option>
            </select>
          </label>
        </div>

        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {filtered.length}
          </span>{" "}
          of {phrases.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm md:text-base text-gray-800">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Word / Phrase
              </th>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Morse
              </th>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Meaning
              </th>
              <th className="py-2 px-3 text-left font-semibold">Copy</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const key = `${p.category}:${p.phrase}`;
              const copied = copiedKey === key;
              return (
                <tr
                  key={key}
                  className="odd:bg-white even:bg-gray-50 hover:bg-sky-50 transition"
                >
                  <td className="py-2 px-3 border-r font-semibold">
                    {p.phrase}
                  </td>
                  <td className="py-2 px-3 border-r font-mono break-words text-sky-900 tracking-wide">
                    {normalizeForCopy(p.morse)}
                    <span className="sr-only">{p.category}</span>
                  </td>
                  <td className="py-2 px-3 border-r text-gray-700">
                    {p.meaning}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      type="button"
                      onClick={() => copy(p.morse, key)}
                      className={`px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition ${
                        copied
                          ? "bg-sky-900 text-white border-sky-900"
                          : "bg-white text-sky-900 border-sky-900 hover:bg-sky-50"
                      }`}
                      aria-label={`Copy Morse for ${p.phrase}`}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-700 leading-relaxed space-y-2">
        <p>
          For puzzles and learning, the slash separator is intentionally
          explicit. If you prefer spacing-only Morse, you can replace{" "}
          <span className="font-mono">/</span> with a larger word gap. If a
          decoder chokes on mixed spacing, normalize your separators first.
        </p>
        <p>
          If you want to generate your own custom word list (for example a class
          roster, a scavenger hunt, or a training set), use the text-to-Morse
          encoder and keep one entry per line. If you want to decode something
          you found online, use the Morse-to-text decoder and clean up word
          boundaries.
        </p>
      </div>
    </section>
  );
}

export default MorsePhraseLookupTable;
