export function formatSummary(lines: Array<[string, string]>) {
  return lines.map(([k, v]) => `${k}: ${v}`).join("\n");
}
