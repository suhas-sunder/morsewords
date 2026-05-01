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

export const paperBackground = {
  backgroundColor: "#f5f2eb",
  backgroundImage:
    "linear-gradient(180deg, #f8f6f1 0%, #f5f2eb 46%, #f7f4ef 100%)",
};

export default function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(9,47,78,0.055) 0, rgba(9,47,78,0.055) 1px, transparent 1.4px), radial-gradient(circle at 78% 42%, rgba(9,47,78,0.04) 0, rgba(9,47,78,0.04) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px, 34px 34px",
        }}
      />

      <div className="absolute left-[max(22px,calc(50%-760px))] top-28 w-[270px] rotate-[-7deg] space-y-7">
        {leftMorseRows.map((row) => (
          <div
            key={row.plain}
            className="font-mono text-[13px] font-extrabold uppercase tracking-[0.2em] text-sky-950/20"
          >
            <div className="mb-2 text-[9px] tracking-[0.26em] text-sky-950/24">
              {row.plain}
            </div>
            <div className="leading-6">{row.morse}</div>
          </div>
        ))}
      </div>

      <div className="absolute right-[max(22px,calc(50%-760px))] top-40 w-[295px] rotate-[7deg] space-y-7 text-right">
        {rightMorseRows.map((row) => (
          <div
            key={row.plain}
            className="font-mono text-[13px] font-extrabold uppercase tracking-[0.2em] text-sky-950/20"
          >
            <div className="mb-2 text-[9px] tracking-[0.26em] text-sky-950/24">
              {row.plain}
            </div>
            <div className="leading-6">{row.morse}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
