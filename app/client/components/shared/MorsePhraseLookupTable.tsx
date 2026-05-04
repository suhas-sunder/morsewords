import * as React from "react";

function MorsePhraseLookupTable() {
 const phrases = [
 // Common words
 {
 phrase:"HELLO",
 morse:".... . .-.. .-.. ---",
 meaning:"Friendly greeting",
 },
 {
 phrase:"GOOD MORNING",
 morse:"--. --- --- -.. -- --- .-. -. .. -. --.",
 meaning:"Polite day greeting",
 },
 {
 phrase:"THANK YOU",
 morse:"- .... .- -. -.- -.-- --- ..-",
 meaning:"Expression of gratitude",
 },
 { phrase:"YES", morse:"-.-- . ...", meaning:"Affirmative / agreement"},
 { phrase:"NO", morse:"-. ---", meaning:"Negative / denial"},
 {
 phrase:"PLEASE",
 morse:".--. .-.. . .- ... .",
 meaning:"Polite request",
 },
 {
 phrase:"LOVE",
 morse:".-.. --- ...- .",
 meaning:"Affection / endearment",
 },
 {
 phrase:"FRIEND",
 morse:"..-. .-. .. . -. -..",
 meaning:"Companionship",
 },
 {
 phrase:"GOODBYE",
 morse:"--. --- --- -.. -... -.-- .",
 meaning:"Farewell / sign-off",
 },

 // Emergency / distress
 {
 phrase:"SOS",
 morse:"... --- ...",
 meaning:"Universal distress signal",
 },
 {
 phrase:"MAYDAY",
 morse:"-- .- -.-- -.. .- -.--",
 meaning:"Distress call (aviation/maritime)",
 },
 {
 phrase:"HELP",
 morse:".... . .-.. .--.",
 meaning:"Request for assistance",
 },
 {
 phrase:"NEED ASSISTANCE",
 morse:"-. . . -.. .- ... ... .. ... - .- -. -.-. .",
 meaning:"Emergency request",
 },
 { phrase:"STOP", morse:"... - --- .--.", meaning:"End of transmission"},

 // Prosigns (procedure signals)
 { phrase:"AR (.-.-.)", morse:".-.-.", meaning:"End of message"},
 { phrase:"AS (.-...)", morse:".-...", meaning:"Wait / standby"},
 { phrase:"BT (-...-)", morse:"-...-", meaning:"Pause / new section"},
 {
 phrase:"CL (-.-..-..)",
 morse:"-.-..-..",
 meaning:"Going off air / closing station",
 },
 {
 phrase:"KN (-.-.-.)",
 morse:"-.-.-.",
 meaning:"Invitation to transmit specifically",
 },
 {
 phrase:"SK (...-.-)",
 morse:"...-.-",
 meaning:"End of contact / signing off",
 },

 // Q-codes (radio shorthand)
 {
 phrase:"QRL",
 morse:"--.- .-. .-..",
 meaning:"Is the frequency busy?",
 },
 { phrase:"QRZ", morse:"--.- .-. --..", meaning:"Who is calling me?"},
 { phrase:"QRS", morse:"--.- .-. ...", meaning:"Send more slowly"},
 { phrase:"QRQ", morse:"--.- .-. --.-", meaning:"Send faster"},
 { phrase:"QTH", morse:"--.- - ....", meaning:"My location is..."},
 {
 phrase:"QSL",
 morse:"--.- ... .-..",
 meaning:"Message received / acknowledgment",
 },
 { phrase:"QSY", morse:"--.- ... -.--", meaning:"Change frequency"},
 { phrase:"QRM", morse:"--.- .-. --", meaning:"Interference (man-made)"},
 {
 phrase:"QRN",
 morse:"--.- .-. -.",
 meaning:"Natural interference / static",
 },
 { phrase:"QRP", morse:"--.- .-. .--.", meaning:"Reduce power"},

 // Abbreviations (CW shorthand)
 {
 phrase:"73",
 morse:"--... ...--",
 meaning:"Best regards (friendly sign-off)",
 },
 {
 phrase:"88",
 morse:"---.. ---..",
 meaning:"Love and kisses (friendly end)",
 },
 {
 phrase:"OM",
 morse:"--- --",
 meaning:"Old man (friendly term for operator)",
 },
 {
 phrase:"YL",
 morse:"-.-- .-..",
 meaning:"Young lady (female operator)",
 },
 {
 phrase:"FB",
 morse:"..-. -...",
 meaning:"Fine business (good signal / message)",
 },
 { phrase:"HR", morse:".... .-.", meaning:"Here"},
 {
 phrase:"TNX",
 morse:"- .... .- -. -..- / -....- / -..- -.",
 meaning:"Thanks",
 },
 { phrase:"CUL", morse:"-.-. ..- .-..", meaning:"See you later"},
 { phrase:"GL", morse:"--. .-..", meaning:"Good luck"},
 { phrase:"GA", morse:"--. .-", meaning:"Good afternoon"},
 { phrase:"GE", morse:"--. .", meaning:"Good evening"},
 { phrase:"GM", morse:"--. --", meaning:"Good morning"},

 // Practice phrases (balanced letter frequency)
 {
 phrase:"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
 morse:"- .... . --.- ..- .. -.-. -.- -... .-. --- .-- -. ..-. --- -..- .--- ..- -- .--. ... --- ...- . .-. - .... . .-.. .- --.. -.-- -.. --- --.",
 meaning:"Pangram (uses every letter)",
 },
 {
 phrase:"PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
 morse:".--. .- -.-. -.- -- -.-- -... --- -..- .-- .. - .... ..-. .. ...- . -.. --- --.. . -. .-.. .. --.- ..- --- .-. .--- ..- --. ...",
 meaning:"Another pangram for practice",
 },
 {
 phrase:"MORSE CODE IS FUN",
 morse:"-- --- .-. ... . -.-. --- -.. . .. ... ..-. ..- -.",
 meaning:"Motivational practice phrase",
 },
 {
 phrase:"KEEP PRACTICING",
 morse:"-.- . . .--. .--. .-. .- -.-. - .. -.-. .. -. --.",
 meaning:"Encouragement to practice regularly",
 },
 {
 phrase:"LISTEN LEARN REPEAT",
 morse:".-.. .. ... - . -. .-.. . .- .-. -. .-. . .--. . .- -",
 meaning:"Training advice for beginners",
 },
 ];

 return (
 <section
 className="my-12 rounded-2xl bg-[#fffdf8] p-6" aria-labelledby="morse-phrases-title"itemScope
 itemType="https://schema.org/Table">
 <h2
 id="morse-phrases-title" className="text-2xl font-bold text-[#0b2447] mb-2" itemProp="name">
 Common Morse Code Phrases, Prosigns, and Abbreviations
 </h2>
 <p
 className="text-gray-700 text-base leading-relaxed mb-6" itemProp="description">
 Explore a complete list of real-world Morse code phrases, radio
 shorthand, and prosigns used by amateur radio operators, maritime and
 aviation communication, and CW learners. Each entry shows the phrase,
 its Morse code pattern, and its meaning or usage context.
 </p>

 <div className="overflow-x-auto rounded-xl bg-white">
 <table className="min-w-full -separate -spacing-0 text-sm md:text-base text-gray-800">
 <thead className="bg-[#f7f4ee]">
 <tr>
 <th className="py-2 px-3 text-left font-semibold">
 Phrase / Abbreviation
 </th>
 <th className="py-2 px-3 text-left font-semibold">
 Morse Code
 </th>
 <th className="py-2 px-3 text-left font-semibold">
 Meaning / Usage
 </th>
 </tr>
 </thead>
 <tbody>
 {phrases.map((p, i) => (
 <tr
 key={i}
 className="odd:bg-white even:bg-[#fffaf2] hover:bg-sky-50 transition">
 <td className="py-2 px-3 font-semibold font-mono">
 {p.phrase}
 </td>
 <td className="py-2 px-3 font-mono text-[#0b2447] tracking-wider">
 {p.morse}
 </td>
 <td className="py-2 px-3 text-gray-700">{p.meaning}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="mt-6 text-sm text-gray-700 leading-relaxed space-y-2">
 <p>
 These Morse code phrases include <strong>Q-codes</strong> (used in
 amateur radio),
 <strong>prosigns</strong> (procedural signals), and{" "}
 <strong>abbreviations</strong> commonly exchanged during CW
 (continuous wave) transmissions. They make communication faster and
 more standardized worldwide.
 </p>
 <p>
 Practicing with these phrases improves both <em>copy speed</em> and{" "}
 <em>transmit rhythm</em>. Focus first on SOS, QTH, QSL, and SK for
 real-world readiness, then build up to longer pangrams like{" "}
 <strong>THE QUICK BROWN FOX</strong>.
 </p>
 <p>
 This table follows the{" "}
 <strong>International Telecommunication Union (ITU)</strong> standards
 and includes terms recognized by{" "}
 <em>ham radio, aviation, and maritime</em> operators globally.
 Bookmark this chart to quickly look up any Morse prosign or radio
 abbreviation.
 </p>
 </div>
 </section>
 );
}


export default MorsePhraseLookupTable;
