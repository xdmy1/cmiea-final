export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};
export type TeamContent = {
  members: TeamMember[];
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
};

export function teamContent(value: unknown): TeamContent | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.members) || data.members.length > 30) return null;
  const members: TeamMember[] = [];
  const ids = new Set<string>();
  for (const item of data.members) {
    if (!item || typeof item !== "object") return null;
    const member = item as Record<string, unknown>;
    if (
      typeof member.id !== "string" ||
      !member.id ||
      ids.has(member.id) ||
      typeof member.name !== "string" ||
      !member.name.trim() ||
      typeof member.role !== "string" ||
      typeof member.image !== "string"
    )
      return null;
    if (
      member.image &&
      !/^(https:\/\/|\/formatori\/|\/assets\/)/.test(member.image)
    )
      return null;
    ids.add(member.id);
    members.push({
      id: member.id,
      name: member.name.trim().slice(0, 120),
      role: member.role.trim().slice(0, 300),
      image: member.image.trim(),
    });
  }
  if (
    ![data.quote, data.quoteAuthor, data.quoteRole].every(
      (value) => typeof value === "string",
    )
  )
    return null;
  return {
    members,
    quote: data.quote as string,
    quoteAuthor: data.quoteAuthor as string,
    quoteRole: data.quoteRole as string,
  };
}
