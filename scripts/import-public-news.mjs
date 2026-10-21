import { mkdir, writeFile } from "node:fs/promises";
import { load } from "cheerio";

// Selected public CMIEA announcements, republished by the municipality.
// Keep the original source on each card; these are not presented as a live
// Facebook feed. New Facebook links can be added to content/news.json directly.
const selection = [
  {
    id: "69405",
    title: "Creativitate din materiale reciclate",
    summary:
      "Ateliere practice la CMIEA despre transformarea cartonului și a materialelor casnice în decorațiuni și obiecte creative.",
  },
  {
    id: "69144",
    title: "O nouă viață pentru hainele vechi",
    summary:
      "Două întâlniri cu Victoria Macovei: tehnica kinusaiga și realizarea florilor decorative din denim.",
  },
  {
    id: "69125",
    title: "Învață să construiești experiențe turistice",
    summary:
      "Radu Țurcan prezintă alegerea temelor, construirea traseelor și valorificarea patrimoniului în cadrul unui curs practic.",
  },
  {
    id: "69040",
    title: "Echilibru în viața profesională",
    summary:
      "Training cu psihologa Olga Colodin despre recunoașterea epuizării profesionale, gestionarea stresului și echilibrul personal.",
  },
  {
    id: "68935",
    title: "O lună de întâlniri în comunitate",
    summary:
      "Programul din octombrie reunește 14 ședințe gratuite ale cluburilor de interes CMIEA, în mai multe domenii.",
  },
  {
    id: "68802",
    title: "Comunicare și negociere în carieră",
    summary:
      "Curs practic cu Felicia Pascăluță, dedicat argumentării și negocierii salariului, responsabilităților și condițiilor de muncă.",
  },
];
const response = await fetch("https://t.me/s/Primaria_Chisinau?q=CMIEA");
if (!response.ok)
  throw new Error("The public announcement source is unavailable.");
const $ = load(await response.text());
await mkdir(new URL("../assets/news/", import.meta.url), { recursive: true });
await mkdir(new URL("../content/", import.meta.url), { recursive: true });
const posts = [];
for (const selected of selection) {
  const item = $(`[data-post="Primaria_Chisinau/${selected.id}"]`);
  const date = item.find("time").attr("datetime");
  const text = item.find(".tgme_widget_message_text").text();
  const photo = item
    .find(".tgme_widget_message_photo_wrap")
    .first()
    .attr("style")
    ?.match(/background-image:url\('([^']+)'\)/)?.[1];
  if (!date || !text.includes("CMIEA") || !photo)
    throw new Error(
      `Selected public announcement ${selected.id} could not be verified.`,
    );
  const image = await fetch(photo);
  if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
    throw new Error(`Image ${selected.id} is unavailable.`);
  await writeFile(
    new URL(`../assets/news/${selected.id}.jpg`, import.meta.url),
    Buffer.from(await image.arrayBuffer()),
  );
  posts.push({
    id: selected.id,
    title: selected.title,
    summary: selected.summary,
    publishedAt: date,
    image: `/assets/news/${selected.id}.jpg`,
    url: `https://t.me/Primaria_Chisinau/${selected.id}`,
    sourceName: "Primăria Chișinău",
    platform: "Telegram",
  });
}
await writeFile(
  new URL("../content/news.json", import.meta.url),
  JSON.stringify(posts, null, 2) + "\n",
);
console.log(
  `Imported ${posts.length} verified public announcements with local images and source links.`,
);
