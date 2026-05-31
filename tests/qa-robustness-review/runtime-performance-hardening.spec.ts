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
  const printableChart = readRepoFile("app/routes/morse-code-printable-chart.tsx");
  const wordSearch = readRepoFile("app/routes/morse-code-word-search-builder.tsx");

  expect(mp3Generator).not.toContain(
    'import { audioBufferToMp3Blob } from "~/client/components/audio/mp3Export"',
  );
  expectDynamicImport(mp3Generator, "~/client/components/audio/mp3Export");

  expect(soundGenerator).not.toContain(
    "import { audioBufferToMp3Blob, type ExportFormat }",
  );
  expectDynamicImport(soundGenerator, "~/client/components/audio/mp3Export");

  expect(printableChart).not.toContain('import QRCode from "qrcode"');
  expect(wordSearch).not.toContain('import QRCode from "qrcode"');
  expectDynamicImport(printableChart, "qrcode");
  expectDynamicImport(wordSearch, "qrcode");
});
