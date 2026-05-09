import { Link, useLocation } from "react-router";

type Article = { slug: string; title: string; date?: string };

const articles: Article[] = [
  {
    slug: "wordskull-vs-absurdle-outwitting-the-adversarial-puzzle",
    title: "WordSkull vs Absurdle: Outwitting the Adversarial Puzzle",
    date: "2025-10-23",
  },
  {
    slug: "wordskull-vs-quordle-multi-grid-madness",
    title: "WordSkull vs Quordle: Single Skulls vs Multi-Grid Madness",
    date: "2025-09-24",
  },
  {
    slug: "wordskull-vs-nyt-connections",
    title: "WordSkull vs NYT Connections: Linking Logic and Dungeon Battles",
    date: "2025-09-14",
  },
  {
    slug: "wordskull-vs-nyt-spelling-bee",
    title: "WordSkull vs NYT Spelling Bee: A Battle of Wits",
    date: "2025-08-18",
  },
  {
    slug: "wordskull-vs-wordle-fantasy-twist",
    title: "WordSkull vs Wordle: A Fantasy Twist on the Word Game Craze",
    date: "2025-08-17",
  },
];

const linkClass = "font-semibold text-sky-900 underline-offset-4 hover:underline";

export default function BlogAside({ className = "" }: { className?: string }) {
  const location = useLocation();
  const currentSlug = location.pathname.split("/").pop();
  const relatedArticles = articles.filter((post) => post.slug !== currentSlug);

  return (
    <aside
      className={`hidden w-[260px] shrink-0 lg:block xl:w-[290px] ${className}`}
    >
      <div className="mw-static-panel rounded-xl bg-[#fffdf8] px-4 py-4">
        <h3 className="text-lg font-extrabold text-sky-950">Articles</h3>
        <ul className="mt-3 space-y-2 text-sm leading-snug">
          {relatedArticles.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className={linkClass}>
                {post.title}
              </Link>
              {post.date ? (
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
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
