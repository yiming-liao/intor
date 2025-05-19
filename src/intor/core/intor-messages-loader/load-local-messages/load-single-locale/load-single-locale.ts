import type { IntorLogger } from "../../../../core/intor-logger/intor-logger";
import type {
  Locale,
  LocaleNamespaceMessages,
  Namespace,
} from "../../../../types/message-structure-types";
import type pLimit from "p-limit";
import fs from "node:fs/promises";
import path from "node:path";
import { loadNamespaceGroup } from "../load-namespace-group";
import { prepareNamespaceGroups } from "../prepare-namespace-groups";

type LoadSingleLocaleOptions = {
  basePath: string;
  locale: Locale;
  namespaces?: Namespace[];
  messages: LocaleNamespaceMessages;
  limit: ReturnType<typeof pLimit>;
  logger?: IntorLogger;
};

/**
 * Loads all message files for a single locale, optionally filtered by namespaces.
 * Merges results into the provided messages object.
 *
 * @param basePath - Base path where locale folders are located.
 * @param locale - Target locale to load.
 * @param namespaces - Optional list of namespaces to load.
 * @param messages - Target message object to be mutated.
 * @param limit - Concurrency limit for file operations.
 * @param logger - Optional logger for debug and warnings.
 * @returns Array of successfully loaded namespaces, or undefined if none found.
 */
export const loadSingleLocale = async ({
  basePath,
  locale,
  namespaces,
  messages,
  limit,
  logger: baseLogger,
}: LoadSingleLocaleOptions): Promise<Namespace[] | undefined> => {
  const logger = baseLogger?.child({ prefix: "loadSingleLocale" });

  const localePath = path.join(basePath, locale);
  const validNamespaces: Namespace[] = [];

  // Check the dir at localePath
  try {
    const stat = await fs.stat(localePath);
    if (!stat.isDirectory()) {
      void logger?.warn("Locale path is not a directory.", {
        locale,
        path: localePath,
      });
      return;
    }
  } catch (error) {
    void logger?.warn("Error checking locale path:", { locale, error });
    return;
  }

  // Prepared namespace groups (Map)
  const namespaceGroups = await prepareNamespaceGroups({
    basePath: localePath,
    limit,
    namespaces: new Set(namespaces || []),
    logger,
  });

  // No namespace groups
  if (namespaceGroups.size === 0) {
    void logger?.warn("No namespace groups found.", {
      locale,
      basePath,
      namespaces,
    });
    return;
  }

  // Log out prepared namespace groups detail
  void logger?.debug("Prepared namespace groups from scanning local files:", {
    namespaceGroups: [...namespaceGroups.entries()].map(([ns, val]) => ({
      namespace: ns,
      isAtRoot: val.isAtRoot,
      fileCounts: val.filePaths.length,
    })),
  });

  // Collect namespace group tasks
  const namespaceGroupTasks = [...namespaceGroups.entries()]
    .filter(
      ([ns]) =>
        !namespaces || namespaces.length === 0 || namespaces.includes(ns),
    )
    .map(([namespace, namespaceGroupValue]) =>
      loadNamespaceGroup({
        locale,
        namespace,
        messages,
        namespaceGroupValue,
        limit,
        logger,
      }).then(() => validNamespaces.push(namespace)),
    );

  // Run namsapace group tasks
  await Promise.all(namespaceGroupTasks);

  // Return valid namespaces
  return validNamespaces;
};
