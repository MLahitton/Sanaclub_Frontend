export function getInitials(input: string | null | undefined): string {
  const raw = (input ?? "").trim();

  if (!raw) {
    return "SC";
  }

  const source = raw.includes("@") ? raw.split("@")[0].trim() : raw;
  const cleaned = source
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "SC";
  }

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";

  return `${first}${last}`.toUpperCase();
}

