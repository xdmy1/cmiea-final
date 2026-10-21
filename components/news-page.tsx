"use client";
import { sitePath } from "@/lib/site-path";

import { useState } from "react";
import { ArrowUpRight, Globe, MessageCircle, Share2 } from "lucide-react";
import { facebookPage } from "@/lib/navigation";
import posts from "@/content/news.json";

const categories = ["Toate postările", "Cursuri", "Cluburi", "Evenimente"];
export function NewsPage() {
  const [category, setCategory] = useState(categories[0]);
  const visible =
    category === categories[0]
      ? posts
      : posts.filter((post) => post.category === category);
  return (
    <main className="news-page social-news-page">
      <div className="social-news-heading">
        <div>
          <p className="news-eyebrow">Din viața CMIEA</p>
          <h1>Noutăți din comunitate</h1>
          <p>Idei, întâlniri și oameni. Urmărește ce se întâmplă la CMIEA.</p>
        </div>
        <a
          className="app-button secondary"
          href={facebookPage}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ph-fill ph-facebook-logo" aria-hidden="true" /> CMIEA pe
          Facebook <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="social-news-layout">
        <aside className="social-profile">
          <div className="social-profile-cover" />
          <img
            src={sitePath("/assets/icon.png")}
            width={64}
            height={64}
            alt=""
            className="social-profile-avatar"
          />
          <div className="social-profile-copy">
            <h2>CMIEA</h2>
            <p>Centrul Municipal de Învățare și Educație a Adulților</p>
            <span>Educație pentru fiecare.</span>
            <a href={sitePath("/despre/")} className="text-link">
              Despre comunitate <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="social-profile-links">
            <a href={sitePath("/cursuri/")}>
              Descoperă cursurile <ArrowUpRight size={15} />
            </a>
            <a href={sitePath("/cluburi/")}>
              Găsește un club <ArrowUpRight size={15} />
            </a>
            <a href={sitePath("/evenimente/")}>
              Vezi evenimentele <ArrowUpRight size={15} />
            </a>
          </div>
        </aside>
        <div className="social-feed">
          <div
            className="social-feed-filters"
            role="group"
            aria-label="Filtrează postările"
          >
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="social-feed-label">
            <i className="ph-fill ph-facebook-logo" aria-hidden="true" />{" "}
            Postări Facebook despre CMIEA · selecție
          </p>
          <div className="social-feed-posts">
            {visible.map((post) => (
              <article className="social-post" key={post.id}>
                <header className="social-post-author">
                  <a
                    className="social-author-avatar"
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={post.sourceName}
                  >
                    R
                  </a>
                  <div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.sourceName}
                    </a>
                    <span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "ro-RO",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Europe/Chisinau",
                          },
                        )}
                      </time>
                      <span aria-hidden="true">·</span>
                      <Globe size={12} aria-hidden="true" />
                      <span>Public</span>
                    </span>
                  </div>
                  <i
                    className="ph-fill ph-facebook-logo social-platform"
                    aria-label="Facebook"
                  />
                </header>
                <div className="social-post-copy">
                  <span className="social-post-category">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <a
                    className="text-link"
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Citește postarea pe Facebook <ArrowUpRight size={15} />
                  </a>
                </div>
                {post.image ? (
                  <a
                    className="social-post-image"
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={sitePath(post.image)}
                      alt=""
                      loading="lazy"
                      width={1000}
                      height={600}
                    />
                  </a>
                ) : null}
                <footer className="social-post-actions">
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={17} /> Comentarii pe Facebook
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 size={17} /> Distribuie
                  </a>
                </footer>
              </article>
            ))}
          </div>
          {!visible.length ? (
            <p className="catalog-status">
              Nu sunt postări în această categorie.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
