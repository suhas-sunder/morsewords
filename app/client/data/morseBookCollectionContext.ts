import type { MorseBookLibrarySummary } from "./morseBookTypes";

export type MorseBookCollectionNeighbor = {
  slug: string;
  title: string;
};

export type MorseBookCollectionContext = {
  collectionTitle: string;
  collectionOrder: number;
  collectionSize: number;
  previousInCollection: MorseBookCollectionNeighbor | null;
  nextInCollection: MorseBookCollectionNeighbor | null;
  searchAliases: string[];
};

type CollectionStory = {
  slug: string;
  title: string;
};

const SHERLOCK_ADVENTURES_COLLECTION_TITLE =
  "The Adventures of Sherlock Holmes";

const SHERLOCK_ADVENTURES_STORIES = [
  { slug: "a-scandal-in-bohemia", title: "A Scandal in Bohemia" },
  { slug: "the-red-headed-league", title: "The Red-Headed League" },
  { slug: "a-case-of-identity", title: "A Case of Identity" },
  {
    slug: "the-boscombe-valley-mystery",
    title: "The Boscombe Valley Mystery",
  },
  { slug: "the-five-orange-pips", title: "The Five Orange Pips" },
  {
    slug: "the-man-with-the-twisted-lip",
    title: "The Man with the Twisted Lip",
  },
  {
    slug: "the-adventure-of-the-blue-carbuncle",
    title: "The Adventure of the Blue Carbuncle",
  },
  {
    slug: "the-adventure-of-the-speckled-band",
    title: "The Adventure of the Speckled Band",
  },
  {
    slug: "the-adventure-of-the-engineer-s-thumb",
    title: "The Adventure of the Engineer's Thumb",
  },
  {
    slug: "the-adventure-of-the-noble-bachelor",
    title: "The Adventure of the Noble Bachelor",
  },
  {
    slug: "the-adventure-of-the-beryl-coronet",
    title: "The Adventure of the Beryl Coronet",
  },
  {
    slug: "the-adventure-of-the-copper-beeches",
    title: "The Adventure of the Copper Beeches",
  },
] satisfies CollectionStory[];

function buildCollectionContexts(
  collectionTitle: string,
  stories: readonly CollectionStory[],
) {
  return stories.map((story, index) => {
    const previousStory = index > 0 ? stories[index - 1] : null;
    const nextStory = index < stories.length - 1 ? stories[index + 1] : null;

    return {
      slug: story.slug,
      context: {
        collectionTitle,
        collectionOrder: index + 1,
        collectionSize: stories.length,
        previousInCollection: previousStory
          ? {
              slug: previousStory.slug,
              title: previousStory.title,
            }
          : null,
        nextInCollection: nextStory
          ? {
              slug: nextStory.slug,
              title: nextStory.title,
            }
          : null,
        searchAliases: [
          "Sherlock Holmes",
          "Adventures of Sherlock Holmes",
          collectionTitle,
          `Chapter ${index + 1}`,
          `${collectionTitle} Chapter ${index + 1}`,
        ],
      } satisfies MorseBookCollectionContext,
    };
  });
}

const COLLECTION_CONTEXTS_BY_SLUG = new Map(
  buildCollectionContexts(
    SHERLOCK_ADVENTURES_COLLECTION_TITLE,
    SHERLOCK_ADVENTURES_STORIES,
  ).map((entry) => [entry.slug, entry.context] as const),
);

export function getMorseBookCollectionContext(slug: string) {
  return COLLECTION_CONTEXTS_BY_SLUG.get(slug) ?? null;
}

export function getMorseBookCollectionLabel(
  context: MorseBookCollectionContext,
) {
  return `${context.collectionTitle} - Chapter ${context.collectionOrder}`;
}

export function getMorseBookCollectionPositionText(
  context: MorseBookCollectionContext,
) {
  return `Chapter ${context.collectionOrder} of ${context.collectionSize} in ${context.collectionTitle}`;
}

export function getMorseBookContextTitle(
  book: Pick<MorseBookLibrarySummary, "slug" | "title">,
) {
  const context = getMorseBookCollectionContext(book.slug);
  if (!context) return book.title;
  return `${getMorseBookCollectionLabel(context)}: ${book.title}`;
}

export function getMorseBookContextSortTitle(
  book: Pick<MorseBookLibrarySummary, "slug" | "title">,
) {
  const context = getMorseBookCollectionContext(book.slug);
  if (!context) return book.title;
  const paddedOrder = String(context.collectionOrder).padStart(4, "0");
  return `${context.collectionTitle} - Chapter ${paddedOrder}: ${book.title}`;
}

export function getMorseBookCollectionSearchText(
  book: Pick<MorseBookLibrarySummary, "slug" | "title">,
) {
  const context = getMorseBookCollectionContext(book.slug);
  if (!context) return "";
  return [
    getMorseBookContextTitle(book),
    context.collectionTitle,
    getMorseBookCollectionLabel(context),
    getMorseBookCollectionPositionText(context),
    ...context.searchAliases,
  ].join(" ");
}
