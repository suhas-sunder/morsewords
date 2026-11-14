import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { checkNavigationBookIndex } from "../../scripts/books/navigation-index.ts";

test("release freshness check accepts current index and rejects stale/missing without writing", async () => {
  assert.ok(await checkNavigationBookIndex() > 0);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "mw-nav-invariant-"));
  const source = path.join(root, "app/client/assets/books/generated");
  await fs.mkdir(source, { recursive: true });
  await fs.mkdir(path.join(root, "public"));
  await fs.writeFile(path.join(source, "library-manifest.json"), '{"books":[]}');
  const target = path.join(root, "public/navigation-books.json");
  await assert.rejects(checkNavigationBookIndex(root), /missing/);
  await assert.rejects(fs.stat(target));
  await fs.writeFile(target, "stale");
  await assert.rejects(checkNavigationBookIndex(root), /stale/);
  assert.equal(await fs.readFile(target, "utf8"), "stale");
  await fs.writeFile(target, '{"schemaVersion":1,"books":[]}\n');
  assert.ok(await checkNavigationBookIndex(root) > 0);
});
