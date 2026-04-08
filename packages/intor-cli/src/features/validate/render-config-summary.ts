import type { MissingByLocale } from "./types";
import { createLogger } from "../../logger";
import { cyan, br, yellow } from "../../render";
import { renderLocaleBlocks } from "./render-locale-blocks";

// { [locale: string]: MissingRequirements; } → { string; MissingRequirements; }[]
function normalizeMissingByLocale(missingByLocale: MissingByLocale) {
  return Object.entries(missingByLocale)
    .map(([locale, missing]) => ({ locale, missing }))
    .filter(
      ({ missing }) =>
        missing.missingMessages.length > 0 ||
        missing.missingReplacements.length > 0 ||
        missing.missingRich.length > 0,
    );
}

export function renderConfigSummary(
  configId: string,
  missingByLocale: MissingByLocale,
  enabled = true,
) {
  if (!enabled) return;
  const logger = createLogger();
  br();

  const entries = normalizeMissingByLocale(missingByLocale);

  if (entries.length === 0) {
    logger.ok(`${cyan(configId)}: no problems found`);
    return;
  }

  // Log header
  logger.header(
    `${cyan(configId)}: ${yellow(entries.length)} problem locale(s)`,
    { lineBreakAfter: 1 },
  );

  // Render locale blocks
  renderLocaleBlocks(entries);

  // Log footer
  logger.footer("", { lineBreakBefore: 1 });
}
