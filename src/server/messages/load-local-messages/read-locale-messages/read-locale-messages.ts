import type { ReadLocaleMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { collectFileEntries } from "./collect-file-entries";
import { parseFileEntries } from "./parse-file-entries";

/**
 * Read and assemble messages for a single locale from the file system.
 *
 * This function acts as a thin orchestration layer:
 * - Collects message file metadata for the locale
 * - Parses files into a single Messages object
 * - Wraps the result under the locale key
 *
 * It does not perform validation or transformation itself.
 */
export const readLocaleMessages = async ({
  locale,
  namespaces,
  rootDir = "messages",
  limit,
  readers,
  loggerOptions,
}: ReadLocaleMessagesParams): Promise<LocaleMessages> => {
  // ---------------------------------------------------------------------------
  // Collect message file entries for the locale
  // ---------------------------------------------------------------------------
  const fileEntries = await collectFileEntries({
    namespaces,
    rootDir: path.resolve(rootDir, locale),
    limit,
    exts: Object.keys(readers || {}),
    loggerOptions,
  });

  // ---------------------------------------------------------------------------
  // Parse collected files into a Messages object (single-locale)
  // ---------------------------------------------------------------------------
  const messages = await parseFileEntries({
    fileEntries,
    limit,
    readers,
    loggerOptions,
  });

  // ---------------------------------------------------------------------------
  // Wrap parsed messages under the locale key
  // ---------------------------------------------------------------------------
  const localeMessages: LocaleMessages = { [locale]: messages };

  return localeMessages;
};
