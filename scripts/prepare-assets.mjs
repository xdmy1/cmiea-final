import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { routes } from "./routes.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
await mkdir(root + "public/legacy", { recursive: true });
for (const directory of ["assets", "formatori", "css", "js"]) {
  await cp(root + directory, root + "public/" + directory, {
    recursive: true,
    filter: (source) => !source.endsWith(".DS_Store"),
  });
}
await cp(root + "js", root + "public/legacy/js", { recursive: true });
for (const entry of await readdir(root + "js", { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
  let code = await readFile(root + "js/" + entry.name, "utf8");
  code = code.replace(/DOMContentLoaded/g, "cmiea:legacy-ready");
  code = code.replace(
    /document\.getElementById\((['"])(burger|close)\1\)\.addEventListener/g,
    "document.getElementById($1$2$1)?.addEventListener",
  );
  for (const [route, filename] of Object.entries(routes)) {
    const escaped = filename.replace(".", "\\.");
    code = code.replace(
      new RegExp(`(["'\x60])(?:\\.\\./|\\./|/)?${escaped}(?=[?"'\x60])`, "g"),
      `$1/${route}/`,
    );
  }
  if (entry.name === "admin.js") {
    code = code.replace(
      "if (!userInput) return;",
      'if (!userSearchInput || userSearchInput.dataset.searchReady) return;\n    userSearchInput.dataset.searchReady = "true";',
    );
    // The React workspace owns tab selection and remembers deep links.
    code = code.replace(
      "showSection('course');",
      "showSection(['course','events','clubs','enrollment','eventRegistrations','clubRegistrations','users'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'course');",
    );
  }
  await writeFile(root + "public/legacy/js/" + entry.name, code);
}
for (const file of ["cursuri.json", "faq.json", "CNAME"])
  await cp(root + file, root + "public/" + file);
await writeFile(root + "public/.nojekyll", "");
for (const [route, file] of Object.entries(routes)) {
  const target = `/${route}/`;
  await writeFile(
    root + "public/" + file,
    `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CMIEA</title><link rel="canonical" href="${target}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript></head><body><a href="${target}">Continuă către CMIEA</a></body></html>`,
  );
}
console.log(
  "Prepared original assets, compatible Firebase forms and legacy URL redirects.",
);
