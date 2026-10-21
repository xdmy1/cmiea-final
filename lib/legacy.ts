import { readFile } from "node:fs/promises";
import { load } from "cheerio";

export type LegacyScript = { src?: string; code?: string; module?: boolean };
export type LegacyDocument = { html: string; scripts: LegacyScript[] };
const pages = new Set([
  "despre",
  "contact",
  "eveniment",
  "club",
  "login",
  "register",
  "register-step2",
  "dashboard",
  "admin",
  "succes",
  "unauthorized",
  "termeni",
  "confidentialitate",
  "cookies",
]);

export async function legacyDocument(page: string): Promise<LegacyDocument> {
  if (!pages.has(page)) throw new Error("Unknown legacy document");
  const source = await readFile(`${process.cwd()}/${page}.html`, "utf8");
  const $ = load(source);
  const scripts: LegacyScript[] = [];
  $("body script, head script[src]").each((_, element) => {
    const script = $(element);
    const src = script.attr("src");
    if (
      script.parents("head").length &&
      !/^(?:\.\.\/|\.\/|\/)?js\//.test(src || "")
    )
      return;
    if (src && !/(?:main|auth-state)\.js/.test(src))
      scripts.push({
        src: src.startsWith("http")
          ? src
          : "/legacy/" + src.replace(/^(?:\.\.\/|\.\/|\/)+/, ""),
        module: script.attr("type") === "module",
      });
    else if (!src && script.text().trim())
      scripts.push({
        code: script
          .text()
          .replace(/DOMContentLoaded/g, "cmiea:legacy-ready")
          .replace(/\/\/ Toggle dark mode \(for demo\)[\s\S]*$/, ""),
      });
  });
  $(
    "body script, body nav, body footer, body > div.fixed:first-child",
  ).remove();
  if (page === "admin") {
    // The old mobile sub-navigation is replaced by the React workspace.
    $("body > div")
      .filter((_, element) => $(element).find("#admin-menu-toggle").length > 0)
      .remove();
    $("#courseSection").parent().attr("class", "legacy-admin-content");
  }
  $("a[href]").each((_, element) => {
    const link = $(element);
    const href = link.attr("href") || "";
    const match = href.match(/^(?:\.\.\/|\.\/|\/)?([\w-]+)\.html([?#].*)?$/);
    if (match)
      link.attr(
        "href",
        `/${match[1] === "index" ? "home" : match[1]}/${match[2] || ""}`,
      );
  });
  const html = $("body").html() || "";
  return { html, scripts };
}
