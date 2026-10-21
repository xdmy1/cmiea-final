import { sitePath } from "@/lib/site-path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import events from "@/content/events.json";

export const dynamicParams = false;
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.archiveSlug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((item) => item.archiveSlug === slug);
  return {
    title: event?.title || "Eveniment încheiat",
    description: event?.description,
  };
}

export default async function ArchivedEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = events.find((item) => item.archiveSlug === slug);
  if (!event) notFound();
  return (
    <>
      <SiteHeader />
      <main className="app-main">
        <article className="app-container archived-event">
          <a className="text-link" href={sitePath("/evenimente/")}>
            <ArrowLeft size={18} aria-hidden="true" /> Toate evenimentele
          </a>
          <div className="archived-event-heading">
            <div className="community-card-labels">
              <span className="section-eyebrow">{event.category}</span>
              <span className="event-status">Încheiat</span>
            </div>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
          </div>
          <div className="archived-event-body">
            <img
              className="archived-event-poster"
              src={sitePath(event.image)}
              alt={`Afișul evenimentului ${event.title}`}
            />
            <div className="archived-event-copy">
              <dl className="archived-event-meta">
                <div>
                  <dt>
                    <CalendarDays size={18} aria-hidden="true" /> Data și ora
                  </dt>
                  <dd>
                    <time dateTime={event.startDate}>
                      {new Date(event.startDate).toLocaleString("ro-RO", {
                        dateStyle: "long",
                        timeStyle: "short",
                        timeZone: "Europe/Chisinau",
                      })}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt>
                    <MapPin size={18} aria-hidden="true" /> Locație
                  </dt>
                  <dd>{event.location}</dd>
                </div>
              </dl>
              {event.details.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="archived-event-notice">
                Acest eveniment s-a încheiat. Înscrierile sunt închise.
              </p>
              <div className="archived-event-sources">
                <h2>Despre această ediție</h2>
                {event.sources.map((source) => (
                  <a
                    className="text-link"
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
