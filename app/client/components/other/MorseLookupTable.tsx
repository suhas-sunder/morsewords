import * as React from "react";

type Row = { symbol: string; morse: string; category:"Letter"|"Number"|"Punctuation"};

const rows: Row[] = [
 // Letters
 { symbol:"A", morse:".-", category:"Letter"},
 { symbol:"B", morse:"-...", category:"Letter"},
 { symbol:"C", morse:"-.-.", category:"Letter"},
 { symbol:"D", morse:"-..", category:"Letter"},
 { symbol:"E", morse:".", category:"Letter"},
 { symbol:"F", morse:"..-.", category:"Letter"},
 { symbol:"G", morse:"--.", category:"Letter"},
 { symbol:"H", morse:"....", category:"Letter"},
 { symbol:"I", morse:"..", category:"Letter"},
 { symbol:"J", morse:".---", category:"Letter"},
 { symbol:"K", morse:"-.-", category:"Letter"},
 { symbol:"L", morse:".-..", category:"Letter"},
 { symbol:"M", morse:"--", category:"Letter"},
 { symbol:"N", morse:"-.", category:"Letter"},
 { symbol:"O", morse:"---", category:"Letter"},
 { symbol:"P", morse:".--.", category:"Letter"},
 { symbol:"Q", morse:"--.-", category:"Letter"},
 { symbol:"R", morse:".-.", category:"Letter"},
 { symbol:"S", morse:"...", category:"Letter"},
 { symbol:"T", morse:"-", category:"Letter"},
 { symbol:"U", morse:"..-", category:"Letter"},
 { symbol:"V", morse:"...-", category:"Letter"},
 { symbol:"W", morse:".--", category:"Letter"},
 { symbol:"X", morse:"-..-", category:"Letter"},
 { symbol:"Y", morse:"-.--", category:"Letter"},
 { symbol:"Z", morse:"--..", category:"Letter"},

 // Numbers
 { symbol:"1", morse:".----", category:"Number"},
 { symbol:"2", morse:"..---", category:"Number"},
 { symbol:"3", morse:"...--", category:"Number"},
 { symbol:"4", morse:"....-", category:"Number"},
 { symbol:"5", morse:".....", category:"Number"},
 { symbol:"6", morse:"-....", category:"Number"},
 { symbol:"7", morse:"--...", category:"Number"},
 { symbol:"8", morse:"---..", category:"Number"},
 { symbol:"9", morse:"----.", category:"Number"},
 { symbol:"0", morse:"-----", category:"Number"},

 // Punctuation (common)
 { symbol:".", morse:".-.-.-", category:"Punctuation"},
 { symbol:",", morse:"--..--", category:"Punctuation"},
 { symbol:"?", morse:"..--..", category:"Punctuation"},
 { symbol:"'", morse:".----.", category:"Punctuation"},
 { symbol:"!", morse:"-.-.--", category:"Punctuation"},
 { symbol:"/", morse:"-..-.", category:"Punctuation"},
 { symbol:"(", morse:"-.--.", category:"Punctuation"},
 { symbol:")", morse:"-.--.-", category:"Punctuation"},
 { symbol:"&", morse:".-...", category:"Punctuation"},
 { symbol:":", morse:"---...", category:"Punctuation"},
 { symbol:";", morse:"-.-.-.", category:"Punctuation"},
 { symbol:"=", morse:"-...-", category:"Punctuation"},
 { symbol:"+", morse:".-.-.", category:"Punctuation"},
 { symbol:"-", morse:"-....-", category:"Punctuation"},
 { symbol:"_", morse:"..--.-", category:"Punctuation"},
 { symbol: '"', morse:".-..-.", category:"Punctuation"},
 { symbol:"@", morse:".--.-.", category:"Punctuation"},
];

export default function MorseLookupTable() {
 return (
 <section className="mt-10 rounded-2xl bg-[#fffdf8] p-6">
 <h2 className="text-2xl font-bold text-neutral-900">Morse Code Dictionary</h2>
 <p className="mt-2 text-gray-700 leading-relaxed">
 Use this lookup table to copy a character&apos;s dot and dash pattern. For translation, use the
 main translator. This page is a quick reference only.
 </p>

 <div className="mt-6 overflow-x-auto rounded-xl bg-white">
 <table className="min-w-[720px] w-full -separate -spacing-0">
 <thead>
 <tr className="text-left bg-[#f7f4ee]">
 <th className="p-3">Character</th>
 <th className="p-3">Morse</th>
 <th className="p-3">Category</th>
 </tr>
 </thead>
 <tbody>
 {rows.map((r) => (
 <tr
 key={`${r.category}-${r.symbol}`}
 className="odd:bg-white even:bg-[#fffaf2] hover:bg-sky-50">
 <td className="p-3 font-semibold">{r.symbol}</td>
 <td className="p-3 font-mono">{r.morse}</td>
 <td className="p-3">{r.category}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </section>
 );
}
