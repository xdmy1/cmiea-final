/** Normalize historical Firestore records before passing values to React. */
export function communityText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    for (const key of ["ro", "text", "label", "name", "value"])
      if (typeof record[key] === "string") return record[key].trim();
  }
  return "";
}
export function communityDate(value: unknown): string {
  let date: Date;
  try {
    if (value instanceof Date) date = value;
    else if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      if (typeof record.toDate === "function") date = record.toDate();
      else if (
        typeof record.seconds === "number" ||
        typeof record._seconds === "number"
      )
        date = new Date(Number(record.seconds ?? record._seconds) * 1000);
      else if (typeof record.timestampValue === "string")
        date = new Date(record.timestampValue);
      else return "";
    } else if (typeof value === "string" && value.trim())
      date = new Date(value);
    else if (typeof value === "number" && Number.isFinite(value))
      date = new Date(value);
    else return "";
    return date instanceof Date && Number.isFinite(date.getTime())
      ? date.toISOString()
      : "";
  } catch {
    return "";
  }
}
export function communitySchedule(value: unknown): string {
  if (Array.isArray(value))
    return value.map(communitySchedule).filter(Boolean).join(", ");
  const text = communityText(value);
  if (text) return text;
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  const day = communitySchedule(record.days ?? record.day);
  const time =
    communityText(record.time) ||
    [communityText(record.startTime), communityText(record.endTime)]
      .filter(Boolean)
      .join("–");
  return [day, communityText(record.frequency), time]
    .filter(Boolean)
    .join(" · ");
}
export function normalizeCommunityItem(value: unknown, id?: string) {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    id: id ?? communityText(record.id),
    name: communityText(record.name),
    title: communityText(record.title),
    description: communityText(record.description),
    image: typeof record.image === "string" ? record.image.trim() : "",
    category: communityText(record.category),
    schedule: communitySchedule(record.schedule),
    startDate: communityDate(record.startDate),
    endDate: communityDate(record.endDate),
    location: communityText(record.location),
    featured: record.featured === true,
    deleted: record.deleted === true,
    archiveSlug: communityText(record.archiveSlug),
  };
}
