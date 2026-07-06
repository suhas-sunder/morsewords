import * as React from "react";
import { Link } from "react-router";

import {
  morseAudiobookPath,
  morseBookPath,
} from "~/client/data/morseBooks";
import {
  getMorseBookContextSortTitle,
  getMorseBookContextTitle,
} from "~/client/data/morseBookCollectionContext";
import { formatMorseBookAuthors } from "~/client/data/morseBookDisplay";
import type { MorseBookLibrarySummary } from "~/client/data/morseBookTypes";

type MorseBookLinkDirectoryProps = {
  books: readonly MorseBookLibrarySummary[];
  mode: "book" | "audiobook";
};

type DirectoryGroup = {
  key: string;
  books: MorseBookLibrarySummary[];
};

function directoryKey(title: string) {
  const firstCharacter = title.match(/[A-Za-z0-9]/)?.[0] ?? "";
  return !firstCharacter || /[0-9]/.test(firstCharacter)
    ? "0-9"
    : firstCharacter.toUpperCase();
}

function groupedBooks(books: readonly MorseBookLibrarySummary[]) {
  const groups = new Map<string, MorseBookLibrarySummary[]>();
  [...books]
    .sort((left, right) => {
      const titleResult = getMorseBookContextSortTitle(left).localeCompare(
        getMorseBookContextSortTitle(right),
      );
      return titleResult !== 0 ? titleResult : left.slug.localeCompare(right.slug);
    })
    .forEach((book) => {
      const key = directoryKey(getMorseBookContextTitle(book));
      const group = groups.get(key) ?? [];
      group.push(book);
      groups.set(key, group);
    });

  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, groupBooks]) => ({ key, books: groupBooks })) satisfies DirectoryGroup[];
}

export default function MorseBookLinkDirectory({
  books,
  mode,
}: MorseBookLinkDirectoryProps) {
  const groups = React.useMemo(() => groupedBooks(books), [books]);
  const isAudiobook = mode === "audiobook";
  const headingId = `complete-morse-${mode}-directory`;
  const anchorPrefix = `morse-${mode}-directory`;

  return (
    <section
      className="mt-10 sm:mt-12"
      aria-labelledby={headingId}
      data-testid={`morse-${mode}-complete-directory`}
      data-mw-directory-count={books.length}
    >
      <div className="max-w-[68ch]">
        <p className="font-mono text-xs font-bold uppercase text-sky-900">
          Complete A-Z directory
        </p>
        <h2
          id={headingId}
          className="mw-heading mt-3 text-3xl font-extrabold text-sky-950 sm:text-4xl"
        >
          Every Morse {isAudiobook ? "audiobook" : "book"}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Open any title directly. This directory includes the full accepted
          library, including books that do not have a long SEO summary yet.
        </p>
      </div>

      <nav
        className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm"
        aria-label={`${isAudiobook ? "Audiobook" : "Book"} directory letters`}
      >
        {groups.map((group) => (
          <a
            key={group.key}
            href={`#${anchorPrefix}-${group.key}`}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            {group.key}
          </a>
        ))}
      </nav>

      <div className="mt-5 divide-y divide-slate-300/60">
        {groups.map((group) => (
          <section
            key={group.key}
            id={`${anchorPrefix}-${group.key}`}
            className="scroll-mt-24 py-5 first:pt-0"
            aria-labelledby={`${anchorPrefix}-${group.key}-heading`}
          >
            <h3
              id={`${anchorPrefix}-${group.key}-heading`}
              className="mw-heading text-xl font-extrabold text-sky-950"
            >
              {group.key}
              <span className="ml-2 font-mono text-xs font-bold text-slate-500">
                {group.books.length}
              </span>
            </h3>
            <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.books.map((book) => (
                <li key={book.slug} className="min-w-0">
                  <Link
                    to={
                      isAudiobook
                        ? morseAudiobookPath(book.slug)
                        : morseBookPath(book.slug)
                    }
                    className="block break-words font-semibold leading-snug text-sky-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    data-mw-directory-slug={book.slug}
                  >
                    {getMorseBookContextTitle(book)}
                  </Link>
                  <span className="mt-0.5 block break-words text-xs leading-relaxed text-slate-600">
                    {formatMorseBookAuthors(book.author)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
