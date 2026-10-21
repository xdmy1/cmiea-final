"use client";
import { sitePath } from "@/lib/site-path";

import { useEffect, useState, type FormEvent } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { firebaseClient } from "@/lib/firebase";
import { teamContent, type TeamContent, type TeamMember } from "@/lib/team";
import { useAuth } from "./auth-provider";
import initialTeam from "@/content/team.json";

export function AdminTeamEditor() {
  const { isAdmin } = useAuth();
  const [draft, setDraft] = useState<TeamContent>(initialTeam);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    getDoc(doc(firebaseClient().db, "siteContent", "team"))
      .then((snapshot) => {
        if (!alive) return;
        const content = teamContent(snapshot.data());
        if (content) setDraft(content);
        setLoading(false);
      })
      .catch(() => {
        if (alive) {
          setLoading(false);
          setError(
            "Conținutul publicat nu a putut fi citit. Reîncarcă înainte de a salva.",
          );
        }
      });
    return () => {
      alive = false;
    };
  }, [retry]);
  function changeMember(
    id: string,
    field: keyof Omit<TeamMember, "id">,
    value: string,
  ) {
    setNotice("");
    setDraft((previous) => ({
      ...previous,
      members: previous.members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member,
      ),
    }));
  }
  function move(index: number, direction: number) {
    setDraft((previous) => {
      const members = [...previous.members];
      [members[index], members[index + direction]] = [
        members[index + direction],
        members[index],
      ];
      return { ...previous, members };
    });
    setNotice("");
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAdmin || saving || loading || error) return;
    const content = teamContent(draft);
    if (!content) {
      setNotice(
        "Verifică numele, funcțiile și linkurile fotografiilor. Sunt acceptate linkuri HTTPS sau fotografii din /formatori/ și /assets/.",
      );
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      await setDoc(doc(firebaseClient().db, "siteContent", "team"), {
        ...content,
        updatedAt: serverTimestamp(),
      });
      setDraft(content);
      setNotice("Modificările au fost publicate pe pagina Despre noi.");
    } catch {
      setNotice(
        "Modificările nu au fost salvate. Verifică accesul de administrator și regula Firestore pentru siteContent/team.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <section id="teamSection" className="admin-team-editor">
      <div className="admin-content-heading">
        <div>
          <h2>Echipă și funcții</h2>
          <p>
            Actualizează persoanele, funcțiile și fotografiile de pe pagina
            „Despre noi”.
          </p>
        </div>
        <a
          className="text-link"
          href={sitePath("/despre/")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Vezi pagina <ArrowUpRight size={16} />
        </a>
      </div>
      {loading ? <p role="status">Se încarcă informațiile publicate…</p> : null}
      {error ? (
        <div className="admin-editor-feedback" role="alert">
          {error}{" "}
          <button
            type="button"
            className="admin-button-secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Reîncarcă
          </button>
        </div>
      ) : null}
      <form className="admin-editor-form" onSubmit={save}>
        <fieldset
          disabled={loading || saving || Boolean(error)}
          className="admin-team-fields"
        >
          <div className="admin-team-list">
            {draft.members.map((member, index) => (
              <fieldset className="admin-form-section" key={member.id}>
                <legend>Persoana {index + 1}</legend>
                <div className="admin-team-person">
                  <div className="admin-team-avatar">
                    {member.image ? (
                      <img src={sitePath(member.image)} alt="" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      Nume și prenume
                      <input
                        value={member.name}
                        onChange={(event) =>
                          changeMember(member.id, "name", event.target.value)
                        }
                        required
                        maxLength={120}
                      />
                    </label>
                    <label className="admin-field">
                      Funcție
                      <input
                        value={member.role}
                        onChange={(event) =>
                          changeMember(member.id, "role", event.target.value)
                        }
                        required
                        maxLength={300}
                      />
                    </label>
                    <label className="admin-field admin-field-wide">
                      Fotografie
                      <input
                        value={member.image}
                        onChange={(event) =>
                          changeMember(member.id, "image", event.target.value)
                        }
                        placeholder="https://… sau /formatori/fotografie.jpg"
                        maxLength={2048}
                      />
                    </label>
                  </div>
                </div>
                <div className="admin-person-actions">
                  <button
                    type="button"
                    className="admin-button-secondary"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Mută ${member.name || "persoana"} mai sus`}
                  >
                    <ArrowUp size={16} /> Mai sus
                  </button>
                  <button
                    type="button"
                    className="admin-button-secondary"
                    disabled={index === draft.members.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Mută ${member.name || "persoana"} mai jos`}
                  >
                    <ArrowDown size={16} /> Mai jos
                  </button>
                  <button
                    type="button"
                    className="admin-button-secondary danger"
                    onClick={() => {
                      setDraft((previous) => ({
                        ...previous,
                        members: previous.members.filter(
                          (item) => item.id !== member.id,
                        ),
                      }));
                      setNotice("");
                    }}
                  >
                    <Trash2 size={16} /> Elimină din listă
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            className="admin-button-secondary"
            disabled={draft.members.length >= 30}
            onClick={() => {
              setDraft((previous) => ({
                ...previous,
                members: [
                  ...previous.members,
                  { id: crypto.randomUUID(), name: "", role: "", image: "" },
                ],
              }));
              setNotice("");
            }}
          >
            <Plus size={17} /> Adaugă persoană
          </button>
          <fieldset className="admin-form-section">
            <legend>Mesajul echipei</legend>
            <div className="admin-form-grid">
              <label className="admin-field admin-field-wide">
                Mesaj
                <textarea
                  rows={4}
                  value={draft.quote}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      quote: event.target.value,
                    }))
                  }
                  maxLength={2000}
                />
              </label>
              <label className="admin-field">
                Autor
                <input
                  value={draft.quoteAuthor}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      quoteAuthor: event.target.value,
                    }))
                  }
                  maxLength={120}
                />
              </label>
              <label className="admin-field">
                Funcția autorului
                <input
                  value={draft.quoteRole}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      quoteRole: event.target.value,
                    }))
                  }
                  maxLength={300}
                />
              </label>
            </div>
          </fieldset>
          <div className="admin-team-save">
            <span>Schimbările devin vizibile după publicare.</span>
            <button className="admin-button-primary" type="submit">
              {saving ? "Se publică…" : "Publică modificările"}
            </button>
          </div>
        </fieldset>
        {notice ? (
          <p className="admin-editor-feedback" role="status">
            {notice}
          </p>
        ) : null}
      </form>
    </section>
  );
}
