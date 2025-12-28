import type { ReadLocaleMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { collectFileEntries } from "./collect-file-entries";
import { parseFileEntries } from "./parse-file-entries";

/**
 * Read messages for a specific locale from the file system.
 *
 * 1. Collects file entries under the specified locale directory.
 * 2. Parses each file into a messages object.
 * 3. Wraps the parsed messages under the locale key.
 */
export const readLocaleMessages = async ({
  locale,
  namespaces,
  rootDir = "messages",
  limit,
  extraOptions: { exts, messagesReader, loggerOptions },
}: ReadLocaleMessagesParams): Promise<LocaleMessages> => {
  // 1. Collect file entries
  const fileEntries = await collectFileEntries({
    namespaces,
    rootDir: path.resolve(process.cwd(), rootDir, locale),
    limit,
    extraOptions: { exts, loggerOptions },
  });

  // 2. Parse file entries
  const messages = await parseFileEntries({
    fileEntries,
    limit,
    extraOptions: { messagesReader, loggerOptions },
  });

  // 3. Wrap the parsed messages under the locale key
  const localeMessages: LocaleMessages = { [locale]: messages };

  return localeMessages;
};
