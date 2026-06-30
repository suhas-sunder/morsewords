import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const APP_RUNTIME_ROOTS = ["app/client", "app/routes"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

type Finding = {
  line: number;
  path: string;
  text: string;
};

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }
  return files;
}

function isCloudflareExportImport(line: string) {
  return (
    /\bimport\s+[^;]*["'][^"']*cloudflare-export[^"']*["']/.test(line) ||
    /\bfrom\s+["'][^"']*cloudflare-export[^"']*["']/.test(line) ||
    /\bimport\s*\(\s*["'][^"']*cloudflare-export[^"']*["']\s*\)/.test(line)
  );
}

const findings: Finding[] = [];

for (const relativeRoot of APP_RUNTIME_ROOTS) {
  const absoluteRoot = path.join(REPO_ROOT, relativeRoot);
  for (const filePath of walkFiles(absoluteRoot)) {
    const relativePath = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      if (!line.includes("cloudflare-export")) return;
      if (!isCloudflareExportImport(line)) return;
      findings.push({
        line: index + 1,
        path: relativePath,
        text: line.trim(),
      });
    });
  }
}

if (findings.length > 0) {
  console.error(
    "App runtime source must not import ignored Cloudflare export artifacts.",
  );
  for (const finding of findings) {
    console.error(`${finding.path}:${finding.line} ${finding.text}`);
  }
  process.exit(1);
}

console.log(
  "No app/runtime imports from app/client/assets/books/cloudflare-export were found.",
);
