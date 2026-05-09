import { Link, useLocation } from "react-router";

type Entry = { slug: string; title: string; date?: string; arc?: string };

const entries: Entry[] = [
  {
    slug: "wordskull-chapter-1-the-wizards-rise-who-was-atriocsoul",
    title: "Chapter 1: The Wizard's Rise",
    date: "2025-08-20",
    arc: "Origins",
  },
];

const linkClass = "font-semibold text-sky-900 underline-offset-4 hover:underline";

export default function LoreSidebar({ className = "" }: { className?: string }) {
  const location = useLocation();
  const currentSlug = location.pathname.split("/").pop();
  const otherChapters = entries.filter((entry) => entry.slug !== currentSlug);

  return (
    <aside
      className={`hidden w-[260px] shrink-0 lg:block xl:w-[290px] ${className}`}
    >
      <div className="mw-static-panel rounded-xl bg-[#fffdf8] px-4 py-4">
        <h3 className="text-lg font-extrabold text-sky-950">Chapters</h3>
        {otherChapters.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-snug">
            {otherChapters.map((entry) => (
              <li key={entry.slug}>
                <Link to={`/lore/${entry.slug}`} className={linkClass}>
                  {entry.title}
                </Link>
                <div className="mt-1 text-xs text-slate-500">
                  {entry.date ? new Date(entry.date).toLocaleDateString() : null}
                  {entry.arc ? (
                    <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em]">
                      {entry.arc}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            More chapters can be added from the preserved lore archive.
          </p>
        )}
      </div>

      <div className="mw-static-panel mt-4 rounded-xl bg-[#fffdf8] px-4 py-4">
        <h3 className="text-lg font-extrabold text-sky-950">
          MorseWords next steps
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-snug">
          <li>
            <Link to="/practice" className={linkClass}>
              Practice Morse code
            </Link>
          </li>
          <li>
            <Link to="/morse-code-word-trainer" className={linkClass}>
              Open the word trainer
            </Link>
          </li>
          <li>
            <Link to="/morse-code-words" className={linkClass}>
              Browse Morse words
            </Link>
          </li>
          <li>
            <Link to="/audio" className={linkClass}>
              Hear Morse audio
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
