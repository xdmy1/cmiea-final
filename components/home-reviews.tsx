"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const partnerLogos = Array.from({ length: 3 }, () => [
  "carusel1.png",
  "carusel2.png",
  "dvv.png",
]).flat();

const reviews = [
  {
    image: "recenzie1.jpg",
    quote:
      '„Mulțumesc echipei CMIEA și GIZ pentru susținere și ocazia specială..."',
    author: "Olga Jumbei • 45 Ani",
  },
  {
    image: "recenzie2.jpg",
    quote: '„CMIEA este locul unde poţi să-ţi alimentezi vocaţia."',
    author: "Valentina Alexa • 42 Ani",
  },
  {
    image: "victor.jpeg",
    quote:
      '„CMIEA oferă instruire de calitate! Atmosferă plăcută și suport continuu."',
    author: "Victor S. • 34 Ani",
  },
  {
    image: "ioana.jpeg",
    quote: '„Profesioniști adevărați! Am dobândit cunoștințe valoroase."',
    author: "Ioana D. • 27 Ani",
  },
];
export function HomeReviews() {
  const track = useRef<HTMLDivElement>(null);
  function move(direction: number, keyboard: boolean) {
    const element = track.current;
    if (!element) return;
    const step =
      element.querySelector<HTMLElement>("article")!.getBoundingClientRect()
        .width + 24;
    const end = element.scrollWidth - element.clientWidth;
    const target =
      direction > 0 && element.scrollLeft >= end - 4
        ? 0
        : direction < 0 && element.scrollLeft <= 4
          ? end
          : element.scrollLeft + direction * step;
    element.scrollTo({
      left: target,
      behavior:
        keyboard || matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
    });
  }
  return (
    <>
      <section className="app-container" aria-label="Partenerii CMIEA">
        <div className="partner-marquee">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="marquee-group"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {partnerLogos.map((file, index) => (
                  <img
                    src={`/assets/${file}`}
                    key={`${file}-${index}`}
                    aria-hidden={index >= 3 ? true : undefined}
                    alt={
                      [
                        "Partener CMIEA",
                        "Partener educațional CMIEA",
                        "DVV International",
                      ][index % 3]
                    }
                    width={120}
                    height={88}
                    loading="lazy"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="reviews"
        className="home-reviews app-container mt-24"
        aria-labelledby="reviews-title"
      >
        <div className="home-reviews-heading">
          <h2
            id="reviews-title"
            className="text-4xl lg:text-6xl font-medium py-3"
          >
            Ce spun formabilii noștrii
          </h2>
          <div className="home-reviews-controls">
            <button
              onClick={(event) => move(-1, event.detail === 0)}
              aria-label="Recenzia precedentă"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={(event) => move(1, event.detail === 0)}
              aria-label="Recenzia următoare"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <div ref={track} className="home-reviews-track">
          {reviews.map((review) => (
            <article className="home-review" key={review.author}>
              <div className="home-review-portrait">
                <img
                  src={`/assets/${review.image}`}
                  alt=""
                  width={120}
                  height={120}
                  loading="lazy"
                />
                <i className="ph ph-quotes" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl md:text-4xl">{review.quote}</p>
                <p className="text-sur mt-6">{review.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
