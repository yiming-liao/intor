import type { DiagnosticGroup } from "./diagnostics/types";
import { createLogger } from "../../logger";
import { dim, gray, cyan, yellow, br } from "../../render";
import { toRelativePath } from "../shared/to-relative-path";

export function renderConfigSummary(
  configId: string,
  grouped: DiagnosticGroup[],
  enabled = true,
) {
  if (!enabled) return;
  const logger = createLogger();
  br();

  if (grouped.length === 0) {
    logger.ok(`${cyan(configId)}: no problems found`);
    return;
  }

  // Log header
  logger.header(
    `${cyan(configId)}: ${yellow(grouped.length)} problem group(s)`,
    { lineBreakAfter: 1 },
  );

  // Print groups
  for (let i = 0; i < grouped.length; i++) {
    const group = grouped[i];
    if (!group) continue;
    const { origin, messageKey, problems, file, lines } = group;

    // e.g. hello (t)
    logger.log(`${messageKey} (${origin})`);

    // e.g.
    // - replacements missing: name
    // - rich tags missing: a
    for (const v of problems) logger.log(gray(`  - ${v}`));

    // e.g. ⚲ examples/extract-test.tsx:7
    logger.log(dim(`  ⚲ ${toRelativePath(file)}:${lines.join(",")}`));

    if (i + 1 !== grouped.length) logger.log();
  }

  // Log footer
  logger.footer("", { lineBreakBefore: 1 });
}
