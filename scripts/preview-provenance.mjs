import { execFileSync } from "node:child_process";

export function assertPreviewHistory(previousReadme, revision, cwd) {
  const previous = previousReadme.match(
    /^Source revision: ([a-f0-9]{40})$/m,
  )?.[1];
  if (!previous)
    throw new Error(
      "Cannot verify the source revision of the existing preview.",
    );
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", previous, revision], {
      cwd,
      stdio: "pipe",
    });
  } catch {
    throw new Error(
      `Preview publication stopped: source ${revision.slice(0, 7)} does not include the previously published source ${previous.slice(0, 7)}. Merge those changes before publishing.`,
    );
  }
}
