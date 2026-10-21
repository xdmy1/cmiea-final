import { sitePath } from "@/lib/site-path";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="app-container page-intro not-found">
        <p className="section-eyebrow">404</p>
        <h1>Pagina nu a fost găsită.</h1>
        <p>Poți reveni la pagina principală sau descoperi cursurile noastre.</p>
        <a href={sitePath("/home/")} className="app-button">
          Înapoi la CMIEA
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
