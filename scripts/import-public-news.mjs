import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

// The publisher's public mirror supplies original Facebook permalinks.
// Keep authorship explicit. This is a selected feed, not the page's live API.
const selection = JSON.parse(
  await readFile(
    new URL("../content/facebook-sources.json", import.meta.url),
    "utf8",
  ),
);
await mkdir(new URL("../assets/news/", import.meta.url), { recursive: true });
const posts = [];
for (const selected of selection) {
  const response = await fetch(selected.sourceUrl, {
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Source unavailable: ${selected.slug}`);
  const $ = load(await response.text());
  const permalink = $('a[href*="facebook.com/"]')
    .map((_, element) => $(element).attr("href"))
    .get()
    .find((url) =>
      /facebook\.com\/Pretura\.sectorului\.riscani\/posts\/(?:pfbid|\d)/.test(
        url,
      ),
    );
  const publishedAt = $('meta[property="article:published_time"]')
    .attr("content")
    ?.slice(0, 10);
  if (!permalink || !publishedAt || !Number.isFinite(Date.parse(publishedAt)))
    throw new Error(
      `Facebook post and publication date could not be verified: ${selected.slug}`,
    );
  const url = new URL(permalink);
  url.hostname = "www.facebook.com";
  url.search = "";
  let image = selected.fallbackImage || "";
  if (image) await access(new URL(".." + image, import.meta.url));
  const remoteImage = $('meta[property="og:image"]').attr("content");
  // Expiring Facebook CDN images are replaced only by a verified cached copy.
  if (remoteImage && new URL(remoteImage).hostname === "rascani.md") {
    const photo = await fetch(remoteImage, {
      signal: AbortSignal.timeout(20000),
    });
    if (photo.ok && photo.headers.get("content-type")?.startsWith("image/")) {
      image = `/assets/news/${selected.slug}.jpg`;
      await writeFile(
        new URL(".." + image, import.meta.url),
        Buffer.from(await photo.arrayBuffer()),
      );
    }
  }
  posts.push({
    id: selected.slug,
    title: selected.title,
    summary: selected.summary,
    category: selected.category,
    publishedAt,
    image,
    url: url.href,
    sourceUrl: selected.sourceUrl,
    sourceName: "Pretura sectorului Rîșcani",
    platform: "Facebook",
  });
}
posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
await writeFile(
  new URL("../content/news.json", import.meta.url),
  JSON.stringify(posts, null, 2) + "\n",
);
console.log(
  `Imported ${posts.length} selected Facebook posts with verified public permalinks.`,
);
