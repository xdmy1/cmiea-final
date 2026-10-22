import { access, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { routes } from "./routes.mjs";

// Fail if the export is incomplete rather than reporting a successful build
// containing only the separately preserved course document.
for (const route of Object.keys(routes)) {
  await access(new URL(`../out/${route}/index.html`, import.meta.url));
}
for (const path of [
  "index.html",
  "_next",
  "assets",
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? [] : ["CNAME"]),
]) {
  await access(new URL(`../out/${path}`, import.meta.url));
}

await writeFile(
  new URL("../out/build-info.json", import.meta.url),
  JSON.stringify({
    sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  }) + "\n",
);
console.log("Complete static export ready in out/.");
