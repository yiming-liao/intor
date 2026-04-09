import type { MissingResult } from "./missing";
import { createLogger } from "../../shared";
import { dim, italic, gray } from "../../shared";

export function renderLocaleBlocks(
  entries: { locale: string; missing: MissingResult }[],
) {
  const logger = createLogger();
  const prefix = dim("│  ");

  for (const [i, entry] of entries.entries()) {
    const { locale, missing } = entry;

    const { missingMessages, missingReplacements, missingRich } = missing;

    // ---------------------------------------------------------------------------
    // Render the locale header
    // ---------------------------------------------------------------------------
    logger.header(italic(locale), { prefix });
    logger.log("", { prefix });

    let hasPrintedSection = false;

    // ---------------------------------------------------------------------------
    // Render missing messages
    // ---------------------------------------------------------------------------
    if (missingMessages.length > 0) {
      logger.log(gray("Missing messages:"), { prefix });
      for (const message of missingMessages) {
        logger.log(`  - ${message}`, { prefix });
      }
      hasPrintedSection = true;
    }

    // ---------------------------------------------------------------------------
    // Render missing replacements
    // ---------------------------------------------------------------------------
    if (missingReplacements.length > 0) {
      if (hasPrintedSection) logger.log("", { prefix });
      logger.log(gray("Missing replacements:"), { prefix });
      for (const { key, name } of missingReplacements) {
        logger.log(`  - ${key}: ${name}`, { prefix });
      }
      hasPrintedSection = true;
    }

    // ---------------------------------------------------------------------------
    // Render missing rich tags
    // ---------------------------------------------------------------------------
    if (missingRich.length > 0) {
      if (hasPrintedSection) logger.log("", { prefix });
      logger.log(gray("Missing rich tags:"), { prefix });
      for (const { key, tag } of missingRich) {
        logger.log(`  - ${key}: ${tag}`, { prefix });
      }
    }

    logger.log("", { prefix });
    logger.footer("", { prefix });

    if (i + 1 !== entries.length) logger.log();
  }
}
