import type { ReadLocaleMessagesOptions } from "./types";
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
  limit,
  rootDir = "messages",
  locale,
  namespaces,
  extraOptions: { exts, messagesReader, loggerOptions } = {},
}: ReadLocaleMessagesOptions): Promise<LocaleMessages> => {
  // 1. Collect file entries
  const fileEntries = await collectFileEntries({
    rootDir: path.resolve(process.cwd(), rootDir, locale),
    namespaces,
    limit,
    extraOptions: { exts, loggerOptions },
  });

  // 2. Parse file entries
  const namespaceMessages = await parseFileEntries({
    fileEntries,
    limit,
    extraOptions: { messagesReader, loggerOptions },
  });

  // 3. Wrap the parsed namespace messages under the locale key
  const localeMessages = { [locale]: namespaceMessages };

  return localeMessages;
};
