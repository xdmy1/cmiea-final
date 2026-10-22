import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readdir, rm, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertPreviewHistory } from "./preview-provenance.mjs";

// Publish only the generated static artifact to a separate personal repository.
// Credentials stay in the OS Git credential helper and are never printed.
const repository = "cmiea-preview";
const branch = "preview";
const basePath = "/" + repository;
await access("out/home/index.html");
const { readFile } = await import("node:fs/promises");
const sourceDirectory = process.cwd();
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const sourceBranch = execFileSync("git", ["branch", "--show-current"], {
  encoding: "utf8",
}).trim();
if (
  !sourceBranch ||
  execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim()
)
  throw new Error(
    "Commit all source changes on a branch before publishing the preview.",
  );
const build = JSON.parse(await readFile("out/build-info.json", "utf8"));
if (build.sourceRevision !== revision || build.basePath !== basePath)
  throw new Error(
    "The preview build does not match the current source revision. Run npm run preview:build again.",
  );
const home = await readFile("out/home/index.html", "utf8");
if (!home.includes(`${basePath}/_next/`))
  throw new Error(
    "Build the preview with NEXT_PUBLIC_BASE_PATH=/cmiea-preview first.",
  );
if ((await readdir("out")).some((file) => /^CNAME(?:\s|$)/.test(file)))
  throw new Error("A preview must not contain a custom domain file.");
const credential = execFileSync("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8",
  stdio: ["pipe", "pipe", "pipe"],
});
const password = credential
  .split("\n")
  .find((line) => line.startsWith("password="))
  ?.slice(9);
if (!password) throw new Error("GitHub authentication is unavailable.");
async function api(path, method = "GET", body) {
  const response = await fetch("https://api.github.com" + path, {
    method,
    headers: {
      Authorization: `Bearer ${password}`,
      Accept: "application/vnd.github+json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}
const user = await api("/user");
if (user.status !== 200 || !user.data.login)
  throw new Error("Cannot identify the authenticated GitHub account.");
const owner = user.data.login;
const fullName = `${owner}/${repository}`;
const url = `https://${owner}.github.io/${repository}/`;
let repo = await api(`/repos/${fullName}`);
if (repo.status === 404) {
  repo = await api("/user/repos", "POST", {
    name: repository,
    description: "CMIEA preview — generated static site from xdmy1/cmiea-final",
    homepage: url,
    private: false,
    auto_init: false,
    has_issues: false,
    has_wiki: false,
  });
  if (repo.status !== 201)
    throw new Error(
      `Cannot create the preview repository: ${repo.data.message}`,
    );
} else if (
  repo.status !== 200 ||
  repo.data.description !==
    "CMIEA preview — generated static site from xdmy1/cmiea-final"
) {
  throw new Error(
    "An unrelated repository already uses the preview name; it will not be changed.",
  );
}
const directory = await mkdtemp(join(tmpdir(), "cmiea-preview-"));
const git = (args) =>
  execFileSync("git", args, {
    cwd: directory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
try {
  git(["init", "--quiet", "--initial-branch", branch]);
  git(["remote", "add", "origin", `https://github.com/${fullName}.git`]);
  const existing = await api(`/repos/${fullName}/git/ref/heads/${branch}`);
  if (existing.status === 200) {
    git(["fetch", "--quiet", "--depth", "1", "origin", branch]);
    git(["checkout", "--quiet", "-B", branch, "FETCH_HEAD"]);
    assertPreviewHistory(
      await readFile(join(directory, "README.md"), "utf8"),
      revision,
      sourceDirectory,
    );
    for (const name of await readdir(directory))
      if (name !== ".git")
        await rm(join(directory, name), { recursive: true, force: true });
  } else if (existing.status !== 404 && existing.status !== 409)
    throw new Error("Cannot inspect the preview publishing branch.");
  await cp("out", directory, { recursive: true });
  await writeFile(
    join(directory, "README.md"),
    `# CMIEA preview\n\nGenerated static preview: ${url}\n\nSource: https://github.com/xdmy1/cmiea-final/tree/${sourceBranch}\n\nSource revision: ${revision}\n\nThis repository contains the generated Next.js static export (HTML, CSS and JavaScript). The application source, components and public assets belong to the source repository linked above.\n\nThis repository publishes the preview branch only and has no custom domain.\n`,
  );
  git(["add", "--all"]);
  if (git(["status", "--porcelain"])) {
    git([
      "commit",
      "--quiet",
      "-m",
      `Publish CMIEA preview ${revision.slice(0, 7)}`,
    ]);
    git(["push", "--quiet", "origin", `HEAD:${branch}`]);
  }
  let pages = await api(`/repos/${fullName}/pages`);
  if (pages.status === 404)
    pages = await api(`/repos/${fullName}/pages`, "POST", {
      build_type: "legacy",
      source: { branch, path: "/" },
    });
  if (![200, 201].includes(pages.status))
    throw new Error(`Cannot enable GitHub Pages: ${pages.data.message}`);
  if (pages.data.cname || pages.data.source?.branch !== branch)
    throw new Error(
      "Unexpected preview hosting configuration; no production settings were changed.",
    );
  console.log(
    JSON.stringify({
      repository: `https://github.com/${fullName}`,
      branch,
      url,
      status: pages.data.status || "queued",
    }),
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
