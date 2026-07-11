import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function readRepoFile(filePath: string) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function expectDynamicImport(source: string, modulePath: string) {
  expect(source).toMatch(
    new RegExp(`import\\(\\s*["']${modulePath.replace(/\//g, "\\/")}["']\\s*\\)`),
  );
}

test("heavy browser-only helpers stay behind user-triggered dynamic imports", () => {
  const mp3Generator = readRepoFile(
    "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
  );
  const soundGenerator = readRepoFile(
    "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
  );
  const morseAudioExport = readRepoFile(
    "app/client/components/shared/export/morseAudioExport.ts",
  );
  const printableChart = readRepoFile("app/routes/morse-code-printable-chart.tsx");
  const wordSearch = readRepoFile("app/routes/morse-code-word-search-builder.tsx");
  const bookBundleExport = readRepoFile(
    "app/client/components/morse-code-book-translator/bookBundleExport.ts",
  );

  expect(mp3Generator).not.toContain(
    'import { audioBufferToMp3Blob } from "~/client/components/audio/mp3Export"',
  );
  expect(mp3Generator).not.toContain('from "@breezystack/lamejs"');

  expect(soundGenerator).not.toContain(
    "import { audioBufferToMp3Blob, type ExportFormat }",
  );
  expect(soundGenerator).not.toContain('from "@breezystack/lamejs"');
  expect(morseAudioExport).not.toContain('from "@breezystack/lamejs"');
  expectDynamicImport(morseAudioExport, "@breezystack/lamejs");

  expect(printableChart).not.toContain('import QRCode from "qrcode"');
  expect(wordSearch).not.toContain('import QRCode from "qrcode"');
  expectDynamicImport(printableChart, "qrcode");
  expectDynamicImport(wordSearch, "qrcode");

  expect(bookBundleExport).not.toContain('from "fflate"');
  expect(bookBundleExport).not.toContain('from "@breezystack/lamejs"');
  expectDynamicImport(bookBundleExport, "fflate");
  expectDynamicImport(bookBundleExport, "@breezystack/lamejs");
});
