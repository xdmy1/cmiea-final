import { sitePath } from "@/lib/site-path";
import { ArrowUpRight } from "lucide-react";
import { facebookPage } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="app-footer">
      <div className="app-container footer-grid">
        <div>
          <a className="footer-brand" href={sitePath("/home/")}>
            CMIEA
          </a>
          <p>
            Învățăm. Ne conectăm.
            <br />
            Creștem împreună.
          </p>
          <a href={facebookPage} target="_blank" rel="noopener noreferrer">
            Urmărește-ne pe Facebook <ArrowUpRight size={14} />
          </a>
        </div>
        <div>
          <h2>Descoperă</h2>
          <a href={sitePath("/cursuri/")}>Cursuri</a>
          <a href={sitePath("/evenimente/")}>Evenimente</a>
          <a href={sitePath("/cluburi/")}>Cluburi</a>
          <a href={sitePath("/noutati/")}>Noutăți</a>
        </div>
        <div>
          <h2>Despre CMIEA</h2>
          <a href={sitePath("/despre/")}>Despre noi</a>
          <a href={sitePath("/contact/")}>Contacte</a>
          <a href={sitePath("/register/")}>Creează cont</a>
        </div>
      </div>
      <div className="app-container footer-bottom">
        <span>© 2026 CMIEA</span>
        <div>
          <a href={sitePath("/termeni/")}>Termeni și condiții</a>
          <a href={sitePath("/confidentialitate/")}>Confidențialitate</a>
          <a href={sitePath("/cookies/")}>Cookies</a>
        </div>
      </div>
    </footer>
  );
}
