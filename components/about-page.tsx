"use client";
import { sitePath } from "@/lib/site-path";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { UserRound } from "lucide-react";
import { firebaseClient } from "@/lib/firebase";
import { teamContent, type TeamContent } from "@/lib/team";
import initialTeam from "@/content/team.json";

export function AboutPage() {
  const [team, setTeam] = useState<TeamContent>(initialTeam);
  useEffect(
    () =>
      onSnapshot(
        doc(firebaseClient().db, "siteContent", "team"),
        (snapshot) => {
          const content = teamContent(snapshot.data());
          if (content) setTeam(content);
        },
        () => {
          /* Keep the last published local content available. */
        },
      ),
    [],
  );
  return (
    <main className="app-main about-page">
      <div className="app-container">
        <div className="page-intro">
          <p className="section-eyebrow">Oamenii din spatele CMIEA</p>
          <h1>Echipa noastră</h1>
          <p>
            CMIEA înseamnă inovație și excelență. Suntem o echipă dedicată, gata
            să oferim soluții eficiente și să creăm un impact real.
          </p>
        </div>
        <div className="team-grid">
          {team.members.map((member) => (
            <article className="team-card" key={member.id}>
              {member.image ? (
                <img
                  src={sitePath(member.image)}
                  alt={member.name}
                  width={400}
                  height={480}
                  loading="lazy"
                />
              ) : (
                <div className="team-photo-placeholder">
                  <UserRound size={60} aria-hidden="true" />
                </div>
              )}
              <div>
                <h2>{member.name}</h2>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
        {team.quote ? (
          <figure className="team-quote">
            <blockquote>„{team.quote}”</blockquote>
            <figcaption>
              {team.quoteAuthor}
              <span>{team.quoteRole}</span>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </main>
  );
}
