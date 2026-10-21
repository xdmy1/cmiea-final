import { ArrowRight } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CourseCatalog } from "./course-catalog";
import { PromoCard } from "./promo-card";
import { HomeReviews } from "./home-reviews";

const topics = [
  "PROGRAMARE",
  "UNELTE GOOGLE",
  "LEADERSHIP",
  "LIMBA ENGLEZĂ",
  "VORBIT ÎN PUBLIC",
  "PARENTING",
  "EXCEL",
  "CONTABILITATE",
  "SECRETARIAT",
  "SMM",
  "ANTREPRENORIAT",
];
export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="app-main">
        <section className="app-container home-hero">
          <div className="home-hero-copy">
            <span className="hero-badge">Cursuri gratuite pentru adulți</span>
            <h1>
              Educație pentru <span>fiecare.</span>
            </h1>
            <p>
              Descoperă cursuri care ți se potrivesc.
              <br />
              Un pas nou, în ritmul tău.
            </p>
            <a className="app-button" href="#cursuri">
              Descoperă cursurile <ArrowRight size={18} />
            </a>
          </div>
          <picture>
            <source
              media="(max-width: 600px)"
              srcSet="/assets/home-phone.png"
            />
            <img
              src="/assets/home-pc.png"
              alt="Învățare și oportunități pentru adulți la CMIEA"
              fetchPriority="high"
            />
          </picture>
        </section>
        <section className="app-container" aria-label="Domenii de învățare">
          <div className="topics-marquee">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="marquee-group"
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <CourseCatalog home />
        <PromoCard />
        <HomeReviews />
      </main>
      <SiteFooter />
    </>
  );
}
