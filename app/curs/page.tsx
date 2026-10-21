import { sitePath } from "@/lib/site-path";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegacyView } from "@/components/legacy-view";
import { legacyDocument } from "@/lib/legacy";

export const metadata = { title: "Detalii curs" };
export default async function CoursePage() {
  return (
    <>
      <SiteHeader />
      <main className="app-main course-detail-page">
        <div className="app-container">
          <a className="text-link" href={sitePath("/cursuri/")}>
            <ArrowLeft size={18} /> Toate cursurile
          </a>
        </div>
        <LegacyView page="curs" document={await legacyDocument("curs")} />
      </main>
      <SiteFooter />
    </>
  );
}
