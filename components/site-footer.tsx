import { ArrowUpRight } from "lucide-react";
import { facebookPage } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="app-footer">
      <div className="app-container footer-grid">
        <div>
          <a className="footer-brand" href="/home/">
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
          <a href="/cursuri/">Cursuri</a>
          <a href="/evenimente/">Evenimente</a>
          <a href="/cluburi/">Cluburi</a>
          <a href="/noutati/">Noutăți</a>
        </div>
        <div>
          <h2>Despre CMIEA</h2>
          <a href="/despre/">Despre noi</a>
          <a href="/contact/">Contacte</a>
          <a href="/register/">Creează cont</a>
        </div>
      </div>
      <div className="app-container footer-bottom">
        <span>© 2026 CMIEA</span>
        <div>
          <a href="/termeni/">Termeni și condiții</a>
          <a href="/confidentialitate/">Confidențialitate</a>
          <a href="/cookies/">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
