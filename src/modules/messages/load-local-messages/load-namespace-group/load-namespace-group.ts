import type { LoadNamespaceGroupOptions } from "./types";
import path from "node:path";
import { getLogger } from "@/shared/logger/get-logger";
import { mergeNamespaceMessages } from "./merge-namespace-messages";

/**
 * Loads and merges messages for a specific locale and namespace.
 */
export const loadNamespaceGroup = async ({
  locale,
  namespace,
  messages,
  namespaceGroupValue,
  limit,
  logger: loggerOptions = { id: "default" },
}: LoadNamespaceGroupOptions) => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-namespace-group" });

  const { isAtRoot, filePaths } = namespaceGroupValue;

  if (filePaths.length === 0) {
    logger.trace(
      `Skipped merging ${locale}/${namespace} because filePaths is empty`,
    );
    return;
  }

  return limit(async () => {
    const { base, sub } = await mergeNamespaceMessages(
      filePaths,
      isAtRoot,
      loggerOptions,
    );

    if (!messages[locale]) {
      messages[locale] = {};
    }

    // For root file ".../en-US/index.json" (Not using namespace)
    if (
      isAtRoot &&
      filePaths.length === 1 &&
      path.basename(filePaths[0]) === "index.json"
    ) {
      messages[locale] = { ...messages[locale], ...base };
      return;
    }

    const finalContent = isAtRoot ? base : { ...base, ...sub };
    messages[locale][namespace] = finalContent;

    if (!isAtRoot && Object.keys(finalContent).length > 0) {
      logger.trace(
        `Merged ${locale}/${namespace} from ${filePaths.length} file(s)`,
        { namespace },
      );
    }
  });
};
