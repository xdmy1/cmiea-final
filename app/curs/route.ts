import { readFile } from "node:fs/promises";

export const dynamic = "force-static";
// Preserve the complete course document, including its original layout and
// enrolment logic. Only its base URL changes to support the clean route.
export async function GET() {
  const html = await readFile(`${process.cwd()}/curs.html`, "utf8");
  return new Response(html.replace("<head>", '<head>\n<base href="/">'), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
