import { ArrowUpRight } from "lucide-react";
import { facebookPage } from "@/lib/navigation";
import posts from "@/content/news.json";

export function NewsPage() {
  return (
    <main className="news-page">
      <p className="news-eyebrow">Din viața CMIEA</p>
      <h1>
        Noutăți din
        <br />
        comunitatea noastră.
      </h1>
      <p className="news-intro">
        Activități, întâlniri și vești din comunitate. O selecție de anunțuri
        publice despre CMIEA, cu link către fiecare sursă.
      </p>
      <div className="news-source-bar">
        <span>Din canalele publice ale comunității</span>
        <a href={facebookPage} target="_blank" rel="noopener noreferrer">
          CMIEA pe Facebook <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="news-grid">
        {posts.map((post) => (
          <article className="news-card" key={post.id}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                src={post.image}
                alt=""
                loading="lazy"
                width={800}
                height={540}
              />
            </a>
            <div className="news-card-copy">
              <div className="news-card-meta">
                <span>
                  {post.sourceName} · {post.platform}
                </span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Europe/Chisinau",
                  })}
                </time>
              </div>
              <h2>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h2>
              <p>{post.summary}</p>
              <a
                className="text-link"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Citește postarea <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
