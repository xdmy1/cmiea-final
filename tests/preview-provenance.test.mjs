import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertPreviewHistory } from "../scripts/preview-provenance.mjs";

test("preview rejects a sibling source branch until previously published fixes are merged", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "cmiea-publish-test-"));
  const git = (...args) =>
    execFileSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" }).trim();
  try {
    git("init", "--quiet");
    git("config", "user.name", "Preview test");
    git("config", "user.email", "preview@example.test");
    await writeFile(join(cwd, "base"), "base");
    git("add", "base");
    git("commit", "--quiet", "-m", "base");
    const base = git("rev-parse", "HEAD");
    git("checkout", "--quiet", "-b", "community-fixes");
    await writeFile(join(cwd, "fixes"), "footer and events");
    git("add", "fixes");
    git("commit", "--quiet", "-m", "community fixes");
    const published = git("rev-parse", "HEAD");
    const readme = `Source revision: ${published}\n`;
    assert.doesNotThrow(() => assertPreviewHistory(readme, published, cwd));
    git("checkout", "--quiet", "-b", "button-update", base);
    await writeFile(join(cwd, "buttons"), "buttons");
    git("add", "buttons");
    git("commit", "--quiet", "-m", "button update");
    assert.throws(
      () => assertPreviewHistory(readme, git("rev-parse", "HEAD"), cwd),
      /does not include the previously published source/,
    );
    git("merge", "--quiet", "--no-edit", "community-fixes");
    assert.doesNotThrow(() =>
      assertPreviewHistory(readme, git("rev-parse", "HEAD"), cwd),
    );
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
