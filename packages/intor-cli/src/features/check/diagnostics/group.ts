import type { Diagnostic, DiagnosticGroup } from "./types";

/**
 * Group diagnostics (by file + messageKey + method).
 */
export function groupDiagnostics(diagnostics: Diagnostic[]): DiagnosticGroup[] {
  const map = new Map<string, DiagnosticGroup>();

  for (const diagnostic of diagnostics) {
    const { severity, origin, message, messageKey, file, line, column } =
      diagnostic;

    // --------------------------------------------------
    // Grouping key
    // - Prefer semantic key (messageKey + method)
    // - Fallback to exact source location
    // --------------------------------------------------
    const groupId = messageKey
      ? `${file}::${messageKey}::${origin}`
      : `${file}::${line}:${column}`;

    // Initialize group if not exists
    if (!map.has(groupId)) {
      map.set(groupId, {
        severity,
        origin,
        messageKey,
        problems: [],
        file,
        lines: [],
      });
    }
    const group = map.get(groupId)!;

    // Aggregate messages & lines
    group.problems.push(message);
    group.lines.push(line);

    // Severity escalation (error > warn)
    if (severity === "error") {
      group.severity = "error";
    }
  }

  // Normalize line numbers (unique + sorted)
  for (const group of map.values()) {
    group.lines = [...new Set(group.lines)].sort((a, b) => a - b);
  }

  return [...map.values()];
}
