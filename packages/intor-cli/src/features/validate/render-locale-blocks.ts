import type { MissingRequirements } from "./missing/collect-missing-requirements";
import { createLogger } from "../../logger";
import { dim, italic, gray } from "../../render";

export function renderLocaleBlocks(
  entries: { locale: string; missing: MissingRequirements }[],
) {
  const logger = createLogger();
  const prefix = dim("│  ");

  for (const [i, entry] of entries.entries()) {
    const { locale, missing } = entry;
    const isLastLocale = i === entries.length - 1;

    const { missingMessages, missingReplacements, missingRich } = missing;

    logger.header(italic(locale), { prefix });
    logger.log("", { prefix });

    let hasPrintedSection = false;

    // messages
    if (missingMessages.length > 0) {
      logger.log(gray("Missing messages:"), { prefix });
      for (const message of missingMessages) {
        logger.log(`  - ${message}`, { prefix });
      }
      hasPrintedSection = true;
    }

    // replacements
    if (missingReplacements.length > 0) {
      if (hasPrintedSection) logger.log("", { prefix });
      logger.log(gray("Missing replacements:"), { prefix });
      for (const { key, name } of missingReplacements) {
        logger.log(`  - ${key}: ${name}`, { prefix });
      }
      hasPrintedSection = true;
    }

    // rich
    if (missingRich.length > 0) {
      if (hasPrintedSection) logger.log("", { prefix });
      logger.log(gray("Missing rich tags:"), { prefix });
      for (const { key, tag } of missingRich) {
        logger.log(`  - ${key}: ${tag}`, { prefix });
      }
    }

    logger.log("", { prefix });
    logger.footer("", { prefix });

    // locale ↔ locale spacing
    if (!isLastLocale) logger.log();
  }
}
