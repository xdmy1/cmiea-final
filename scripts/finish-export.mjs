import { mkdir, readFile, writeFile, stat, rm } from "node:fs/promises";

// Static route handlers can emit an extensionless file. GitHub Pages requires
// an index document for directory routes, so normalise this one preserved page.
const coursePath = new URL("../out/curs", import.meta.url);
const info = await stat(coursePath).catch(() => null);
if (info?.isFile()) await rm(coursePath);
await mkdir(coursePath, { recursive: true });
const course = await readFile(new URL("../curs.html", import.meta.url), "utf8");
await writeFile(
  new URL("index.html", coursePath.href + "/"),
  course.replace("<head>", '<head>\n<base href="/">'),
);
console.log("Static export ready in out/; course layout and source preserved.");
