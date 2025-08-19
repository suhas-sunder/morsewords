import * as React from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MorseWords - Translate and Play Morse Code" },
    {
      name: "description",
      content:
        "Clean light-theme Morse translator with audio playback, WPM and tone controls. Separate Text → Morse and Morse → Text tools. Upcoming Morse word game.",
    },
    {
      name: "keywords",
      content:
        "morse code, translator, text to morse, morse to text, cw, wpm, tone, audio",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

// ITU-ish core map
const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "/": "-..-.",
  "'": ".----.",
  "!": "-.-.--",
  "-": "-....-",
  "@": ".--.-.",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  '"': ".-..-.",
  "(": "-.--.",
  ")": "-.--.-",
};
const MORSE_TO_TEXT = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#f7f8fb",
    color: "#111317",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    margin: 0,
  },
  wrap: { maxWidth: 1120, margin: "0 auto", padding: 24 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #e6e8ef",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 44,
    height: 44,
    border: "2px solid #0b2447",
    borderRadius: 10,
    background: "#fff",
    position: "relative",
  },
  siteTitle: { fontWeight: 800, letterSpacing: 0.3, fontSize: "1.15rem" },
  tagline: { color: "#5a616c", fontSize: ".95rem" },
  pill: {
    border: "1px solid #e6e8ef",
    padding: "8px 12px",
    borderRadius: 999,
    background: "#fff",
    color: "#0b2447",
    fontWeight: 800,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 24,
    padding: "24px 0",
  },
  h1: {
    fontSize: "clamp(1.8rem, 2.6vw + 1rem, 3rem)",
    lineHeight: 1.15,
    margin: 0,
  },
  lead: { marginTop: 8, color: "#5a616c", fontSize: "1.05rem" },
  card: {
    background: "#fff",
    border: "1px solid #e6e8ef",
    borderRadius: 16,
    boxShadow: "0 1px 0 rgba(11,36,71,0.14)",
  },
  cardPad: { padding: 16 },
  section: { padding: "8px 0 24px" },
  sectionTitle: { fontSize: "1.35rem", margin: "0 0 12px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  label: { fontSize: ".9rem", color: "#5a616c" },
  textarea: {
    width: "100%",
    minHeight: 140,
    padding: 12,
    border: "1px solid #e6e8ef",
    borderRadius: 10,
    background: "#fff",
    color: "#111317",
    font: '500 0.98rem/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
  },
  input: {
    width: "100%",
    minHeight: 40,
    padding: 10,
    border: "1px solid #e6e8ef",
    borderRadius: 10,
    background: "#fff",
    color: "#111317",
    font: '600 0.98rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
  },
  controls: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimary: {
    border: "1px solid #0b2447",
    background: "#0b2447",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnSecondary: {
    border: "1px solid #0b2447",
    background: "#fff",
    color: "#0b2447",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnGhost: {
    border: "1px solid #e6e8ef",
    background: "#fff",
    color: "#111317",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  note: { color: "#5a616c", fontSize: ".9rem" },
  footer: {
    color: "#5a616c",
    fontSize: ".9rem",
    textAlign: "center",
    padding: "28px 0",
  },
};

function LogoBars() {
  return (
    <>
      <span
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          top: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 8,
          width: "50%",
          bottom: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
    </>
  );
}

function useAudio() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const stopRef = React.useRef(false);

  function ditMs(wpm: number) {
    return 1200 / wpm;
  }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function tone(ms: number, hz: number) {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = hz;
    gain.gain.value = 0.001;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    await sleep(ms);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);
    await sleep(14);
    osc.stop();
  }

  async function playMorse(
    code: string,
    wpm: number,
    hz: number,
    wordGapUnits = 7
  ) {
    stopRef.current = false;
    const unit = ditMs(wpm);
    const parts = code.trim().split(/(\s+)/);
    for (let i = 0; i < parts.length; i++) {
      if (stopRef.current) break;
      const token = parts[i];
      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units = spaces >= 7 ? wordGapUnits : spaces >= 3 ? 3 : 1;
        await sleep(units * unit);
        continue;
      }
      for (let s = 0; s < token.length; s++) {
        if (stopRef.current) break;
        const ch = token[s];
        if (ch === ".") await tone(unit, hz);
        else if (ch === "-") await tone(3 * unit, hz);
        if (s < token.length - 1) await sleep(unit);
      }
    }
  }

  function stop() {
    stopRef.current = true;
  }
  return { playMorse, stop };
}

function textToMorse(text: string): string {
  return text
    .normalize("NFKC")
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((c) => TEXT_TO_MORSE[c] || "")
        .filter(Boolean)
        .join(" ")
    )
    .join("   ");
}
function morseToText(code: string): string {
  return code
    .trim()
    .replace(/\s{7,}/g, "       ")
    .split(/\s{3,}/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((sym) => MORSE_TO_TEXT[sym] || "")
        .join("")
    )
    .join(" ");
}

export default function Home() {
  // Shared controls
  const [wpm, setWpm] = React.useState(20);
  const [freq, setFreq] = React.useState(600);
  const { playMorse, stop } = useAudio();

  // Section A: Text → Morse
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  // Section B: Morse → Text
  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  function numWithin(v: string | number, d: number, min: number, max: number) {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return d;
    return Math.max(min, Math.min(max, n));
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <LogoBars />
            </div>
            <div>
              <div style={styles.siteTitle}>MorseWords</div>
              <div style={styles.tagline}>
                Translate, listen, and practice Morse code.
              </div>
            </div>
          </div>
          <span style={styles.pill}>Instant Translator</span>
        </header>

        {/* Hero */}
        <section style={styles.hero}>
          <div>
            <h1 style={styles.h1}>
              A clean Morse translator with audio playback
            </h1>
            <p style={styles.lead}>
              Convert words to Morse and back with accurate spacing. Adjust
              speed and tone, then play clean sine audio. Light theme, no
              gradients.
            </p>
          </div>
          <div className="card" style={{ ...styles.card, ...styles.cardPad }}>
            <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>
              Quick Controls
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={styles.label}>Speed (WPM)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={wpm}
                  onChange={(e) => setWpm(numWithin(e.target.value, 20, 5, 60))}
                />
              </div>
              <div>
                <label style={styles.label}>Tone (Hz)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={freq}
                  onChange={(e) =>
                    setFreq(numWithin(e.target.value, 600, 200, 2000))
                  }
                />
              </div>
            </div>
            <p style={{ ...styles.note, marginTop: 8 }}>
              Standard timing: dit one unit. Dah three. Letter gap three. Word
              gap seven.
            </p>
          </div>
        </section>

        {/* Translator A: Text → Morse */}
        <section style={styles.section} aria-labelledby="t2m-title">
          <h2 id="t2m-title" style={styles.sectionTitle}>
            Text → Morse
          </h2>
          <div style={{ ...styles.card, ...styles.cardPad }}>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label} htmlFor="plainA">
                  Plain Text
                </label>
                <textarea
                  id="plainA"
                  style={styles.textarea}
                  value={plainA}
                  onChange={(e) => setPlainA(e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label} htmlFor="morseA">
                  Morse Output
                </label>
                <textarea
                  id="morseA"
                  style={styles.textarea}
                  value={morseA}
                  readOnly
                />
              </div>
            </div>
            <div style={styles.controls}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigator.clipboard.writeText(morseA)}
              >
                Copy Morse
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => playMorse(morseA, wpm, freq)}
              >
                Play Audio
              </button>
              <button style={styles.btnGhost} onClick={stop}>
                Stop
              </button>
              <span style={{ ...styles.note, marginLeft: "auto" }}>
                Three spaces between letters. Seven between words.
              </span>
            </div>
          </div>
        </section>

        {/* Translator B: Morse → Text */}
        <section style={styles.section} aria-labelledby="m2t-title">
          <h2 id="m2t-title" style={styles.sectionTitle}>
            Morse → Text
          </h2>
          <div style={{ ...styles.card, ...styles.cardPad }}>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label} htmlFor="morseB">
                  Morse Input
                </label>
                <textarea
                  id="morseB"
                  style={styles.textarea}
                  value={morseB}
                  onChange={(e) => setMorseB(e.target.value)}
                  placeholder="... --- ..."
                />
              </div>
              <div>
                <label style={styles.label} htmlFor="textB">
                  Text Output
                </label>
                <textarea
                  id="textB"
                  style={styles.textarea}
                  value={textB}
                  readOnly
                />
              </div>
            </div>
            <div style={styles.controls}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigator.clipboard.writeText(textB)}
              >
                Copy Text
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => playMorse(morseB, wpm, freq)}
              >
                Play Audio
              </button>
              <button style={styles.btnGhost} onClick={stop}>
                Stop
              </button>
              <span style={{ ...styles.note, marginLeft: "auto" }}>
                Use three spaces between letters, seven between words.
              </span>
            </div>
          </div>
        </section>

        {/* Learn / SEO content */}
        <section style={styles.section} aria-labelledby="learn-title">
          <h2 id="learn-title" style={styles.sectionTitle}>
            Learn and practice
          </h2>
          <div style={{ ...styles.card, ...styles.cardPad }}>
            <p style={{ margin: 0, color: "#5a616c", fontSize: "1.02rem" }}>
              Start with short phrases. Listen for rhythm at 15 to 20 WPM. Raise
              speed as you improve. The upcoming word game will make daily
              practice simple and fun.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Instant Text to Morse Conversion</h2>
          <p style={{ color: "#555" }}>
            Our translator instantly turns any word or phrase into Morse code.
            Whether you are learning the basics or decoding historical signals,
            this tool makes conversion simple, fast, and reliable.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Accurate Morse to Text Translation
          </h2>
          <p style={{ color: "#555" }}>
            Paste Morse code into the translator and get clean text output. The
            converter supports letters, numbers, and punctuation, making it a
            complete solution for decoding real-world Morse messages.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Morse Translator With Audio</h2>
          <p style={{ color: "#555" }}>
            Learning Morse is easier when you hear it. With our audio playback
            feature, you can listen to dits and dahs at different speeds and
            tones. This helps improve recognition and builds real listening
            skills.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Practice and Learn Anywhere</h2>
          <p style={{ color: "#555" }}>
            The MorseWords translator works directly in your browser, with no
            installation. Translate text, practice listening, and copy results
            from desktop, tablet, or mobile - always available when you need it.
          </p>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>How the Morse Translator Works</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              The converter maps letters, numbers, and punctuation to
              International Morse and applies standard timing. One dit is one
              unit. A dah is three units. Spacing inside a letter is one unit,
              between letters is three units, and between words is seven units.
              This keeps on-screen output and audio playback consistent.
            </p>
            <ol style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
              <li>
                Type text to create Morse instantly, or paste Morse to decode
                back to text.
              </li>
              <li>
                Use the Convert buttons to lock in the result, then copy it or
                listen with audio playback.
              </li>
              <li>
                Adjust WPM and tone to train your ear at comfortable speeds.
              </li>
            </ol>
          </div>
        </section>

        {/* Supported characters */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Supported Characters and Punctuation
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Letters A–Z and digits 0–9 are fully supported, plus common
              punctuation. Unsupported symbols are ignored to keep results
              clean.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Letters and Numbers
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                    fontSize: "0.95rem",
                  }}
                >
                  A–Z, 0–9
                </div>
              </div>
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Punctuation
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                    fontSize: "0.95rem",
                  }}
                >
                  . , ? / ' ! - @ : ; = + ( ) "
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timing and spacing */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Timing and Spacing</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Dit length is one unit. Dah length is three units.</li>
              <li>Gap inside a character is one unit.</li>
              <li>Gap between letters is three units.</li>
              <li>Gap between words is seven units.</li>
            </ul>
            <p style={{ color: "#555", marginTop: 12 }}>
              For best decoding, keep three spaces between letters and seven
              spaces between words when pasting Morse.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Examples to Try</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                HELLO WORLD
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .... . .-.. .-.. --- .-- --- .-. .-.. -..
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                MORSE CODE
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                -- --- .-. ... . -.-. --- -.. .
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                GOOD LUCK
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                --. --- --- -.. .-.. ..- -.- -.-
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                CQ
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                -.-. --.-
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Troubleshooting</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>
                If output looks merged, add spaces. Three between letters, seven
                between words.
              </li>
              <li>
                If a character does not appear, it is likely unsupported
                punctuation. Remove the symbol and try again.
              </li>
              <li>
                For clearer audio, try a tone near 600–700 Hz and start near 20
                WPM.
              </li>
            </ul>
          </div>
        </section>

        {/* History of Morse */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>A Brief History of Morse Code</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Morse code was developed in the 1830s by Samuel Morse and Alfred
              Vail as a way to transmit messages across telegraph lines. It
              quickly became the backbone of long-distance communication, used
              in railroads, maritime signaling, aviation, and emergency
              services. Today, enthusiasts and learners continue to keep it
              alive through translators, radio practice, and educational games.
            </p>
          </div>
        </section>

        {/* Benefits of Learning */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Why Learn Morse Code?</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Emergency Use
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                SOS (... --- ...) is still a recognized global distress signal.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Brain Training
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Learning Morse improves memory, focus, and auditory skills.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Cultural Heritage
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Keep alive a language that shaped modern communication.
              </p>
            </div>
          </div>
        </section>

        {/* Educational Uses */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Educational Uses of Morse Code</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Teachers often use Morse code to spark interest in history,
              physics, and language learning. From understanding sound waves to
              practicing rhythm and timing, Morse brings an interactive element
              into classrooms. Our translator and word game make it easy to
              introduce students to these timeless concepts.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>MorseWords vs Other Translators</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                MorseWords
              </div>
              <ul
                style={{
                  color: "#555",
                  margin: 0,
                  paddingLeft: 18,
                  lineHeight: 1.65,
                }}
              >
                <li>Word-to-Morse and Morse-to-word conversion</li>
                <li>Audio playback for real listening practice</li>
                <li>Interactive game for daily learning</li>
              </ul>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Other Tools
              </div>
              <ul
                style={{
                  color: "#555",
                  margin: 0,
                  paddingLeft: 18,
                  lineHeight: 1.65,
                }}
              >
                <li>Text conversion only</li>
                <li>No training or typing practice</li>
                <li>Limited accuracy for symbols and punctuation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mobile Friendly */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Mobile-Friendly Morse Learning</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is built for mobile and desktop browsers. Translate,
              listen, and play anywhere you go. Whether you have a quick moment
              on your phone or want to dedicate longer sessions on your
              computer, the same clean experience is available across devices.
            </p>
          </div>
        </section>

        {/* Advanced Practice */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Advanced Morse Practice</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Once you master basic letters and numbers, challenge yourself with
              advanced practice sessions. Our translator supports punctuation,
              symbols, and even custom phrases, so you can simulate real-world
              radio messages or puzzle scenarios. Perfect for contest prep and
              ham operators.
            </p>
          </div>
        </section>

        {/* Gamified Learning */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Gamified Morse Learning</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Turn practice into play. The upcoming MorseWords game blends speed
              typing with Morse decoding, making each session fun and
              competitive. Earn streaks, track your WPM, and unlock harder
              challenges as you improve. Learning Morse doesn’t have to feel
              like study - it can feel like play.
            </p>
          </div>
        </section>

        {/* Typing & Speed Training */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Morse Typing and Speed Training</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Practice typing Morse as fast as you can while keeping accuracy
              high. With adjustable WPM targets and real-time feedback, you’ll
              build both speed and confidence. This is one of the most effective
              ways to train your ear and hand coordination for Morse code
              fluency.
            </p>
          </div>
        </section>

        {/* Real-Life Applications */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Real-Life Applications of Morse Code
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Beyond history, Morse code is still used today in emergency
              signaling, survival scenarios, and even by people with
              disabilities as an accessible communication tool. Knowing Morse
              gives you a timeless skill that can help in unexpected situations.
            </p>
          </div>
        </section>

        {/* SEO Long-tail: Free & Online */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Free Online Morse Translator and Game
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is completely free to use - no downloads or sign-ups
              required. Translate text to Morse instantly, listen to audio, and
              soon, play our online game. Whether you are a beginner searching
              “free Morse code practice” or an expert looking for “online Morse
              translator,” this site delivers.
            </p>
          </div>
        </section>

        {/* Accessibility */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Accessible Morse Learning</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is designed to be accessible for everyone. Clear fonts,
              high contrast, and simple audio controls make it easy for learners
              of all ages. For accessibility needs, Morse code can even be
              practiced visually or with sound, supporting multiple learning
              styles.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Morse Translator FAQ</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                What speed should I start with?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Begin around 15 to 20 WPM, then raise speed as accuracy
                improves.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Does punctuation work?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Yes. Period, comma, question mark, slash, quotes, hyphen, plus,
                equals, and more.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Can I listen without converting?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Paste Morse and use audio playback at your chosen WPM and tone.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Why are spaces required?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Spacing separates symbols and words so the translator can decode
                correctly.
              </p>
            </div>
          </div>
        </section>

        {/* Learning path */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Learn Morse the Smart Way</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ol
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Begin with the most common letters: E, T, A, I, N, O.</li>
              <li>
                Add pairs with distinct rhythms, for example K and R, M and S.
              </li>
              <li>
                Introduce numbers and key punctuation once letters feel
                automatic.
              </li>
              <li>
                Practice with words and short phrases to cement pattern memory.
              </li>
            </ol>
            <p style={{ color: "#555", marginTop: 12 }}>
              Keep character speed near 15 to 20 WPM and increase it over time.
              This builds recognition that transfers to real listening.
            </p>
          </div>
        </section>

        {/* Audio training tips */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Audio Training Tips</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Use a tone near 600 to 700 Hz for comfortable listening.</li>
              <li>Practice short sessions, then rest your ears.</li>
              <li>Focus on rhythm and spacing rather than counting symbols.</li>
              <li>
                Repeat tricky letters in isolation, then embed them in words.
              </li>
            </ul>
          </div>
        </section>

        {/* Game: What it is */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>About the Morse Word Game</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              The Morse word game turns practice into a daily challenge. Decode
              Morse, type the correct word, and track your progress. Puzzles
              focus on common words and short phrases so you build recognition
              and speed without feeling overwhelmed.
            </p>
            <ul style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
              <li>Short daily puzzles for quick wins.</li>
              <li>Balanced difficulty that grows with your skill.</li>
              <li>Built around accurate timing and spacing rules.</li>
            </ul>
          </div>
        </section>

        {/* Game: How to play */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>How to Play</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ol
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Listen to the audio or read the code shown on screen.</li>
              <li>
                Type your guess as plain text. Use hints if you get stuck.
              </li>
              <li>
                Submit your answer to reveal the correct decoding and earn
                points.
              </li>
            </ol>
            <p style={{ color: "#555", marginTop: 12 }}>
              Each round reinforces letter patterns and common sound groups so
              you build muscle memory for dits and dahs.
            </p>
          </div>
        </section>

        {/* Game: Modes */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Game Modes</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Daily Challenge
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                One puzzle per day. Short and focused for consistent practice.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Practice Pack
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Unlimited drills that target letters, numbers, and common words.
              </p>
            </div>
          </div>
        </section>

        {/* Progress and goals */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Progress and Personal Goals</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Set a clear goal for each week. You might aim for two clean daily
              puzzles, or a higher WPM at the same accuracy. Small, steady
              improvements add up.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Consistency
                </div>
                <p style={{ color: "#555", margin: 0 }}>
                  Practice a little every day to build recognition.
                </p>
              </div>
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Accuracy
                </div>
                <p style={{ color: "#555", margin: 0 }}>
                  Keep mistakes low before pushing speed.
                </p>
              </div>
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Speed
                </div>
                <p style={{ color: "#555", margin: 0 }}>
                  Increase WPM once you feel confident.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample puzzles */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Sample Puzzle Ideas</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Common Words
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .... . .-.. .-.. --- .-- --- .-. .-.. -..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Decode and type the answer to earn points.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Numbers and Symbols
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .---- ..--- ...-- .-.-.- --..-- ..--..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Practice decoding digits and punctuation in short sets.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ for the game */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Morse Word Game FAQ</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Do I need audio to play?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                No. You can decode by reading the code or by listening.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                How long is each round?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Rounds are short so you can practice daily without fatigue.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                What should I focus on first?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Focus on recognition and spacing. Speed will follow.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Is this good for beginners?
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Yes. The game starts simple and grows with your skill.
              </p>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} MorseWords. Clean tools for Morse code.
        </footer>
      </div>
    </div>
  );
}
