import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCatalog } from "@/components/course-catalog";
import { CommunityCatalog } from "@/components/community-catalog";
import { NewsPage } from "@/components/news-page";
import { AdminWorkspace } from "@/components/admin-workspace";
import { LegacyView } from "@/components/legacy-view";
import { ProtectedView } from "@/components/protected-view";
import { legacyDocument } from "@/lib/legacy";

const titles: Record<string, string> = {
  home: "Educație pentru fiecare",
  cursuri: "Cursuri gratuite pentru adulți",
  evenimente: "Evenimente",
  cluburi: "Cluburi",
  noutati: "Noutăți din comunitate",
  despre: "Despre noi",
  contact: "Contacte",
  eveniment: "Detalii eveniment",
  club: "Detalii club",
  login: "Autentificare",
  register: "Creează cont",
  "register-step2": "Completează profilul",
  dashboard: "Contul meu",
  admin: "Administrare",
  succes: "Înscriere reușită",
  unauthorized: "Acces restricționat",
  termeni: "Termeni și condiții",
  confidentialitate: "Confidențialitate",
  cookies: "Politica cookies",
};
export function generateStaticParams() {
  return Object.keys(titles).map((page) => ({ page }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: titles[page] || "CMIEA" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!titles[page]) notFound();
  if (page === "home") return <HomePage />;
  if (page === "admin")
    return (
      <>
        <SiteHeader />
        <ProtectedView admin>
          <AdminWorkspace document={await legacyDocument("admin")} />
        </ProtectedView>
      </>
    );
  let content;
  if (page === "noutati") content = <NewsPage />;
  else if (page === "cursuri")
    content = (
      <main>
        <CourseCatalog original />
      </main>
    );
  else if (["evenimente", "cluburi"].includes(page))
    content = (
      <main className="app-main">
        <div className="app-container page-intro">
          <p className="section-eyebrow">Comunitatea CMIEA</p>
          <h1>{titles[page]}</h1>
          <p>
            {page === "evenimente"
              ? "Întâlniri care inspiră. Descoperă atelierele și activitățile comunității noastre."
              : "Găsește oameni cu aceleași pasiuni. Descoperă cluburile și alătură-te comunității."}
          </p>
        </div>
        <CommunityCatalog kind={page === "evenimente" ? "events" : "clubs"} />
      </main>
    );
  else
    content = (
      <main className="legacy-main">
        <LegacyView document={await legacyDocument(page)} page={page} />
      </main>
    );
  return (
    <>
      <SiteHeader />
      {page === "dashboard" || page === "register-step2" ? (
        <ProtectedView>{content}</ProtectedView>
      ) : (
        content
      )}
      <SiteFooter />
    </>
  );
}
