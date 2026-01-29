import * as React from "react";

export default function HowItWorksPractice() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Practice mode
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2447] tracking-tight">
          How this practice mode works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          This page is for repetition drills. You get one prompt at a time, type
          your answer, and get immediate feedback.
        </p>
      </div>

      <div className="mt-5 border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <ol className="m-0 pl-5 space-y-3 text-gray-800">
          <li>
            Pick a drill type: convert <strong>Text → Morse</strong>, decode{" "}
            <strong>Morse → Text</strong>, or use <strong>Mixed</strong>.
          </li>
          <li>
            You get <strong>one prompt at a time</strong>. Type your answer and
            press <strong>Check</strong>.
          </li>
          <li>
            You’ll see <strong>instant correctness feedback</strong>. If you
            miss, the correct answer is shown so you can repeat it.
          </li>
          <li>
            Use <strong>Next</strong> to keep drilling. Your streak and accuracy
            only reset when you choose to reset.
          </li>
        </ol>

        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          Tip: spacing matters in Morse. This page accepts common spacing styles,
          then normalizes your input before checking.
        </p>
      </div>
    </section>
  );
}
