import type pLimit from "p-limit";
import { Locale, LocaleNamespaceMessages, Namespace } from "intor-translator";
import { logry } from "logry";
import { NamespaceGroupValue } from "../prepare-namespace-groups";
import { mergeNamespaceMessages } from "./merge-namespace-messages";

type LoadNamespaceGroupOptions = {
  locale: Locale;
  namespace: Namespace;
  messages: LocaleNamespaceMessages;
  namespaceGroupValue: NamespaceGroupValue;
  limit: ReturnType<typeof pLimit>;
  loggerId: string;
};

/**
 * Loads and merges messages for a specific locale and namespace.
 *
 * @param locale - Locale identifier (e.g., "en", "zh")
 * @param namespace - Message namespace (e.g., "common", "auth")
 * @param messages - Target object to store merged messages
 * @param namespaceGroupValue - Files and metadata for the namespace group
 * @param limit - Concurrency limiter from p-limit
 * @param logger - Optional logger for debug output
 * @returns A promise that resolves when loading is complete
 */
export const loadNamespaceGroup = async ({
  locale,
  namespace,
  messages,
  namespaceGroupValue,
  limit,
  loggerId,
}: LoadNamespaceGroupOptions) => {
  const logger = logry({ id: loggerId, scope: "loadNamespaceGroup" });
  const { isAtRoot, filePaths } = namespaceGroupValue;

  if (filePaths.length === 0) {
    logger?.debug?.(
      `Skipped merging [${locale}][${namespace}] because filePaths is empty`,
    );
    return;
  }

  return limit(async () => {
    const { base, sub } = await mergeNamespaceMessages(
      filePaths,
      isAtRoot,
      loggerId,
    );

    if (!messages[locale]) {
      messages[locale] = {};
    }

    const finalContent = isAtRoot ? base : { ...base, ...sub };
    messages[locale][namespace] = finalContent;

    if (!isAtRoot && Object.keys(finalContent).length > 0) {
      logger?.debug(
        `Merged ${locale}/${namespace} from ${filePaths.length} file(s)`,
        { namespace },
      );
    }
  });
};
