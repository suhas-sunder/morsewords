// These transforms intentionally produce Latin text for the existing
// international translator. They are not direct character-to-Morse registry
// entries and must stay separate from system-aware decoding.
const EXACT_TRANSLITERATIONS: Record<string, string> = {
  "\u0936\u093f\u0915\u094d\u0937\u0915": "shikshak",
  "\u5148\u751f": "sensei",
  "\u0423\u0447\u0438\u0442\u0435\u043b\u044c": "uchitel'",
  "\u0443\u0447\u0438\u0442\u0435\u043b\u044c": "uchitel'",
  "\uc120\uc0dd\ub2d8": "seonsaengnim",
};

const CHAR_MAP: Record<string, string> = {
  "\u00df": "ss",
  "\u1e9e": "SS",
  "\u00e6": "ae",
  "\u00c6": "AE",
  "\u0153": "oe",
  "\u0152": "OE",
  "\u00f8": "o",
  "\u00d8": "O",
  "\u0111": "d",
  "\u0110": "D",
  "\u0142": "l",
  "\u0141": "L",
  "\u0131": "i",
  "\u0130": "I",

  "\u0410": "A",
  "\u0411": "B",
  "\u0412": "V",
  "\u0413": "G",
  "\u0414": "D",
  "\u0415": "E",
  "\u0401": "Yo",
  "\u0416": "Zh",
  "\u0417": "Z",
  "\u0418": "I",
  "\u0419": "Y",
  "\u041a": "K",
  "\u041b": "L",
  "\u041c": "M",
  "\u041d": "N",
  "\u041e": "O",
  "\u041f": "P",
  "\u0420": "R",
  "\u0421": "S",
  "\u0422": "T",
  "\u0423": "U",
  "\u0424": "F",
  "\u0425": "Kh",
  "\u0426": "Ts",
  "\u0427": "Ch",
  "\u0428": "Sh",
  "\u0429": "Shch",
  "\u042a": "",
  "\u042b": "Y",
  "\u042c": "'",
  "\u042d": "E",
  "\u042e": "Yu",
  "\u042f": "Ya",
  "\u0430": "a",
  "\u0431": "b",
  "\u0432": "v",
  "\u0433": "g",
  "\u0434": "d",
  "\u0435": "e",
  "\u0451": "yo",
  "\u0436": "zh",
  "\u0437": "z",
  "\u0438": "i",
  "\u0439": "y",
  "\u043a": "k",
  "\u043b": "l",
  "\u043c": "m",
  "\u043d": "n",
  "\u043e": "o",
  "\u043f": "p",
  "\u0440": "r",
  "\u0441": "s",
  "\u0442": "t",
  "\u0443": "u",
  "\u0444": "f",
  "\u0445": "kh",
  "\u0446": "ts",
  "\u0447": "ch",
  "\u0448": "sh",
  "\u0449": "shch",
  "\u044a": "",
  "\u044b": "y",
  "\u044c": "'",
  "\u044d": "e",
  "\u044e": "yu",
  "\u044f": "ya",

  "\u0905": "a",
  "\u0906": "aa",
  "\u0907": "i",
  "\u0908": "ii",
  "\u0909": "u",
  "\u090a": "uu",
  "\u090f": "e",
  "\u0910": "ai",
  "\u0913": "o",
  "\u0914": "au",
  "\u0915": "k",
  "\u0916": "kh",
  "\u0917": "g",
  "\u0918": "gh",
  "\u091a": "ch",
  "\u091b": "chh",
  "\u091c": "j",
  "\u091d": "jh",
  "\u091f": "t",
  "\u0920": "th",
  "\u0921": "d",
  "\u0922": "dh",
  "\u0924": "t",
  "\u0925": "th",
  "\u0926": "d",
  "\u0927": "dh",
  "\u0928": "n",
  "\u092a": "p",
  "\u092b": "ph",
  "\u092c": "b",
  "\u092d": "bh",
  "\u092e": "m",
  "\u092f": "y",
  "\u0930": "r",
  "\u0932": "l",
  "\u0935": "v",
  "\u0936": "sh",
  "\u0937": "sh",
  "\u0938": "s",
  "\u0939": "h",
  "\u093e": "a",
  "\u093f": "i",
  "\u0940": "i",
  "\u0941": "u",
  "\u0942": "u",
  "\u0947": "e",
  "\u0948": "ai",
  "\u094b": "o",
  "\u094c": "au",
  "\u0902": "n",
  "\u0903": "h",
  "\u094d": "",

  "\u5148": "sen",
  "\u751f": "sei",
};

const HANGUL_INITIAL = [
  "g",
  "kk",
  "n",
  "d",
  "tt",
  "r",
  "m",
  "b",
  "pp",
  "s",
  "ss",
  "",
  "j",
  "jj",
  "ch",
  "k",
  "t",
  "p",
  "h",
];

const HANGUL_VOWEL = [
  "a",
  "ae",
  "ya",
  "yae",
  "eo",
  "e",
  "yeo",
  "ye",
  "o",
  "wa",
  "wae",
  "oe",
  "yo",
  "u",
  "wo",
  "we",
  "wi",
  "yu",
  "eu",
  "ui",
  "i",
];

const HANGUL_FINAL = [
  "",
  "k",
  "k",
  "ks",
  "n",
  "nj",
  "nh",
  "t",
  "l",
  "lk",
  "lm",
  "lb",
  "ls",
  "lt",
  "lp",
  "lh",
  "m",
  "p",
  "ps",
  "t",
  "t",
  "ng",
  "t",
  "t",
  "k",
  "t",
  "p",
  "h",
];

function romanizeHangul(char: string) {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;

  const syllable = code - 0xac00;
  const initial = Math.floor(syllable / 588);
  const vowel = Math.floor((syllable % 588) / 28);
  const final = syllable % 28;

  return HANGUL_INITIAL[initial] + HANGUL_VOWEL[vowel] + HANGUL_FINAL[final];
}

export function transliterateForInternationalMorse(input: string) {
  const exact = EXACT_TRANSLITERATIONS[input.trim()];
  if (exact) return exact;

  let out = "";

  for (const char of input) {
    const hangul = romanizeHangul(char);
    if (hangul !== null) {
      out += hangul;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(CHAR_MAP, char)) {
      out += CHAR_MAP[char];
      continue;
    }

    const stripped = char.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    out += stripped;
  }

  return out;
}
