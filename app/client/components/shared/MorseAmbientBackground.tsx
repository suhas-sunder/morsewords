const leftMorseRows = [
  { plain: "MorseWords", morse: "-- --- .-. ... . .-- --- .-. -.. ..." },
  { plain: "text to morse", morse: "- . -..- -   - ---   -- --- .-. ... ." },
  {
    plain: "morse code translator",
    morse:
      "-- --- .-. ... .   -.-. --- -.. .   - .-. .- -. ... .-.. .- - --- .-.",
  },
  {
    plain: "decode morse code",
    morse: "-.. . -.-. --- -.. .   -- --- .-. ... .   -.-. --- -.. .",
  },
  {
    plain: "international morse",
    morse: ".. -. - . .-. -. .- - .. --- -. .- .-..   -- --- .-. ... .",
  },
  { plain: "hello world", morse: ".... . .-.. .-.. ---   .-- --- .-. .-.. -.." },
  { plain: "cq cq", morse: "-.-. --.-   -.-. --.-" },
  { plain: "sos", morse: "... --- ..." },
];

const rightMorseRows = [
  { plain: "made with love", morse: "-- .- -.. .   .-- .. - ....   .-.. --- ...- ." },
  {
    plain: "built by Suhas Sunder",
    morse:
      "-... ..- .. .-.. -   -... -.--   ... ..- .... .- ...   ... ..- -. -.. . .-.",
  },
  { plain: "morse to text", morse: "-- --- .-. ... .   - ---   - . -..- -" },
  { plain: "learn morse code", morse: ".-.. . .- .-. -.   -- --- .-. ... .   -.-. --- -.. ." },
  {
    plain: "morse code decoder",
    morse: "-- --- .-. ... .   -.-. --- -.. .   -.. . -.-. --- -.. . .-.",
  },
  { plain: "practice morse", morse: ".--. .-. .- -.-. - .. -.-. .   -- --- .-. ... ." },
  { plain: "dit dah", morse: "-.. .. -   -.. .- ...." },
  { plain: "seventy three", morse: "--... ...--" },
];

const sideRailStyle = {
  width: "max(0px, calc((100vw - 1160px) / 2 - 48px))",
};

const morseRowClassName =
  "mw-ambient-accent font-mono text-[13px] font-extrabold uppercase tracking-[0.2em] text-sky-950/34";
const morseLabelClassName =
  "mw-ambient-accent-strong mb-2 text-[9px] tracking-[0.26em] text-sky-950/40";

export default function MorseAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden min-[1360px]:block"
    >
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={sideRailStyle}
      >
        <div className="absolute right-5 top-28 w-[320px] rotate-[-7deg] space-y-7">
          {leftMorseRows.map((row) => (
            <div
              key={row.plain}
              className={morseRowClassName}
            >
              <div className={morseLabelClassName}>
                {row.plain}
              </div>
              <div className="leading-6">{row.morse}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-y-0 right-0 overflow-hidden"
        style={sideRailStyle}
      >
        <div className="absolute left-5 top-40 w-[330px] rotate-[7deg] space-y-7 text-right">
          {rightMorseRows.map((row) => (
            <div
              key={row.plain}
              className={morseRowClassName}
            >
              <div className={morseLabelClassName}>
                {row.plain}
              </div>
              <div className="leading-6">{row.morse}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
