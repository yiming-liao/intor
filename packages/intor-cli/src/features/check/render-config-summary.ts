import type { DiagnosticGroup } from "./diagnostics";
import { createLogger } from "../../shared";
import { dim, gray, cyan, yellow, br } from "../../shared";
import { toRelativePath } from "../../shared";

export function renderConfigSummary(
  configId: string,
  grouped: DiagnosticGroup[],
  enabled = true,
) {
  if (!enabled) return;
  const logger = createLogger();
  br();

  // Render the empty state when no problems are found
  if (grouped.length === 0) {
    logger.ok(`${cyan(configId)}: no problems found`);
    return;
  }

  // ---------------------------------------------------------------------------
  // Render the summary header
  // ---------------------------------------------------------------------------
  logger.header(
    `${cyan(configId)}: ${yellow(grouped.length)} problem group(s)`,
    { lineBreakAfter: 1 },
  );

  // ---------------------------------------------------------------------------
  // Render each grouped diagnostic
  // ---------------------------------------------------------------------------
  for (let i = 0; i < grouped.length; i++) {
    const group = grouped[i];
    if (!group) continue;
    const { origin, messageKey, problems, file, lines } = group;

    // [title]
    // e.g. hello (t)
    logger.log(`${messageKey} (${origin})`);

    // [issues]
    // e.g.
    // - replacements missing: name
    // - rich tags missing: a
    for (const v of problems) logger.log(gray(`  - ${v}`));

    // [location]
    // e.g. ⚲ examples/extract-test.tsx:7
    logger.log(dim(`  ⚲ ${toRelativePath(file)}:${lines.join(",")}`));

    if (i + 1 !== grouped.length) logger.log(); // line breaks for non-last
  }

  // ---------------------------------------------------------------------------
  // Render the summary footer
  // ---------------------------------------------------------------------------
  logger.footer("", { lineBreakBefore: 1 });
}
