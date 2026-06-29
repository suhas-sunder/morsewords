import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Check = {
  name: string;
  status: "pass" | "info" | "fail";
  notes: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const MAX_FUNCTION_BYTES = 220 * 1024 * 1024;
const WARN_SERVER_BUNDLE_BYTES = 25 * 1024 * 1024;

const BULK_PATH_PATTERNS = [
  /app[\\/]client[\\/]assets[\\/]books[\\/]cloudflare-export[\\/]books/i,
  /app[\\/]client[\\/]assets[\\/]books[\\/]generated[\\/][^\\/]+[\\/]sections/i,
  /app[\\/]client[\\/]assets[\\/]books[\\/]generated[\\/][^\\/]+[\\/]processed_book\.json/i,
  /app[\\/]client[\\/]assets[\\/]books[\\/]generated[\\/][^\\/]+[\\/]cleaned_book\.json/i,
];

const STATIC_EXPORT_ROOT_PATTERN =
  /path\.join\(process\.cwd\(\),\s*["']app["'],\s*["']client["'],\s*["']assets["'],\s*["']books["'],\s*["']cloudflare-export["']\)/;

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function sizeOfFiles(files: string[]) {
  return files.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0);
}

function relative(filePath: string) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

function checkFunctionTrees(): Check[] {
  const roots = [
    path.join(REPO_ROOT, ".netlify/functions"),
    path.join(REPO_ROOT, ".netlify/v1/functions"),
  ].filter((root) => fs.existsSync(root));

  if (!roots.length) {
    return [
      {
        name: "Netlify function package tree",
        status: "info",
        notes: [
          "No .netlify/functions or .netlify/v1/functions tree was produced locally; checking build/server fallback instead.",
        ],
      },
    ];
  }

  const checks: Check[] = [];
  for (const root of roots) {
    const files = walkFiles(root);
    const size = sizeOfFiles(files);
    const matchingBulkFiles = files.filter((filePath) =>
      BULK_PATH_PATTERNS.some((pattern) => pattern.test(relative(filePath))),
    );
    const status =
      size > MAX_FUNCTION_BYTES || matchingBulkFiles.length > 0 ? "fail" : "pass";
    checks.push({
      name: `Netlify function package tree ${relative(root)}`,
      status,
      notes: [
        `Size: ${formatBytes(size)}.`,
        `Files: ${files.length}.`,
        matchingBulkFiles.length
          ? `Bulk book/export files found: ${matchingBulkFiles
              .slice(0, 5)
              .map(relative)
              .join(", ")}.`
          : "No bulk cloudflare-export book payloads or generated section payloads found in the local function tree.",
      ],
    });
  }
  return checks;
}

function checkServerBundle(): Check {
  const serverBundlePath = path.join(REPO_ROOT, "build/server/server.js");
  if (!fs.existsSync(serverBundlePath)) {
    return {
      name: "React Router server bundle",
      status: "info",
      notes: ["build/server/server.js is unavailable; run npm run build:netlify before this audit."],
    };
  }

  const size = fs.statSync(serverBundlePath).size;
  const source = fs.readFileSync(serverBundlePath, "utf8");
  const hasStaticExportRoot = STATIC_EXPORT_ROOT_PATTERN.test(source);
  const status =
    size > WARN_SERVER_BUNDLE_BYTES || hasStaticExportRoot ? "fail" : "pass";

  return {
    name: "React Router server bundle",
    status,
    notes: [
      `Size: ${formatBytes(size)}.`,
      hasStaticExportRoot
        ? "Server bundle still contains a static fs path to app/client/assets/books/cloudflare-export."
        : "Server bundle does not contain the previous static fs path to app/client/assets/books/cloudflare-export.",
    ],
  };
}

function checkPublishedBuild(): Check {
  const buildClientRoot = path.join(REPO_ROOT, "build/client");
  const files = walkFiles(buildClientRoot);
  const bulkExportFiles = files.filter((filePath) =>
    /build[\\/]client[\\/]books[\\/]|build[\\/]client[\\/]cloudflare-export[\\/]/i.test(
      relative(filePath),
    ),
  );
  return {
    name: "Published static build",
    status: bulkExportFiles.length ? "fail" : "pass",
    notes: [
      `build/client files: ${files.length}.`,
      bulkExportFiles.length
        ? `Unexpected exported book payload files in build/client: ${bulkExportFiles
            .slice(0, 5)
            .map(relative)
            .join(", ")}.`
        : "Cloudflare export payloads are not copied into build/client.",
    ],
  };
}

const checks = [...checkFunctionTrees(), checkServerBundle(), checkPublishedBuild()];
const failures = checks.filter((check) => check.status === "fail");

console.log("Netlify function size audit");
for (const check of checks) {
  console.log(`- ${check.status.toUpperCase()} ${check.name}`);
  for (const note of check.notes) console.log(`  ${note}`);
}

if (failures.length) {
  console.error(
    `Netlify function size audit failed: ${failures.map((check) => check.name).join(", ")}`,
  );
  process.exitCode = 1;
}
