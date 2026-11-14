import type { MorseBookLibrarySummary, MorseBookManifest } from "./morseBookTypes";

/** Existing publication contract, shared by runtime and generated discovery data. */
export function isMorseBookPublishReady(book: Pick<MorseBookLibrarySummary, "source"> | MorseBookManifest) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    book.source.approvalSource === "external-authority" ||
    (book.source.approvalSource === "owner-reviewed" && book.source.rightsReviewed === true) ||
    (book.source.approvalSource === undefined && book.source.rightsReviewed === true);
  return approvedBySource && book.source.publishReady === true &&
    book.source.rightsStatus === "approved" && book.source.processingAllowed === true;
}
