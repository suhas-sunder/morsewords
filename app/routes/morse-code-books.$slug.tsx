import type { Route } from "./+types/morse-code-books.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
import {
  UNPUBLISHED_BOOK_PREVIEW_PARAM,
  UNPUBLISHED_BOOK_PREVIEW_VALUE,
  getDefaultMorseBookSectionId,
  getMorseBookManifest,
  getMorseBookSection,
  isMorseBookPublishReady,
  morseBookPath,
} from "~/client/data/morseBooks";
import { absoluteUrl } from "~/client/data/routes";

function isUnpublishedPreviewRequest(request: Request) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      UNPUBLISHED_BOOK_PREVIEW_VALUE
  );
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Morse book not found", { status: 404 });
  }

  const previewMode = isUnpublishedPreviewRequest(request);
  const book = await getMorseBookManifest(slug, {
    includeUnpublished: previewMode,
  });
  if (!book) {
    throw new Response("Morse book not found", { status: 404 });
  }

  if (!isMorseBookPublishReady(book) && !previewMode) {
    throw new Response("Morse book not found", { status: 404 });
  }

  const defaultSectionId = getDefaultMorseBookSectionId(book);
  if (!defaultSectionId) {
    throw new Response("Morse book section not found", { status: 404 });
  }

  const initialSection = await getMorseBookSection(book, defaultSectionId);
  if (!initialSection) {
    throw new Response("Morse book section not found", { status: 404 });
  }

  const previewState: "unpublished" | null =
    previewMode && !isMorseBookPublishReady(book) ? "unpublished" : null;

  return {
    book,
    initialSection,
    previewMode: previewState,
  };
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Morse book not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  if (data.previewMode === "unpublished") {
    return [
      { title: `Unpublished Morse book preview: ${data.book.title} | MorseWords` },
      {
        name: "description",
        content:
          "Development-only noindex preview for a generated Morse book artifact before rights review.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const path = morseBookPath(data.book.slug);
  const canonical = absoluteUrl(path);
  return [
    { title: `${data.book.title} in Morse Code | MorseWords` },
    {
      name: "description",
      content: `Read ${data.book.title} as cleaned book text, preview Morse code, and prepare browser-local Morse audio or video settings.`,
    },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:url", content: canonical },
    { name: "robots", content: "index,follow" },
  ];
};

export default function MorseBookRoute({ loaderData }: Route.ComponentProps) {
  return (
    <MorseBookPage
      book={loaderData.book}
      initialSection={loaderData.initialSection}
      previewMode={loaderData.previewMode}
    />
  );
}
