import type { LoadSingleLocaleOptions } from "./types";
import fs from "node:fs/promises";
import path from "node:path";
import { loadNamespaceGroup } from "@/modules/messages/load-local-messages/load-namespace-group";
import { prepareNamespaceGroups } from "@/modules/messages/load-local-messages/prepare-namespace-groups";
import { getLogger } from "@/shared/logger/get-logger";

/**
 * Loads all message files for a single locale, optionally filtered by namespaces.
 * Merges results into the provided messages object.
 */
export const loadSingleLocale = async ({
  basePath,
  locale,
  namespaces,
  messages,
  limit,
  logger: loggerOptions = { id: "default" },
}: LoadSingleLocaleOptions): Promise<string[] | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-single-locale" });

  const localePath = path.join(basePath, locale);
  const validNamespaces: string[] = [];

  // Check the dir at localePath
  try {
    const stat = await fs.stat(localePath);
    if (!stat.isDirectory()) {
      logger.warn("Locale path is not a directory.", {
        locale,
        path: localePath,
      });
      return;
    }
  } catch (error) {
    logger.warn("Error checking locale path.", { locale, error });
    return;
  }

  // Prepared namespace groups (Map)
  const namespaceGroups = await prepareNamespaceGroups({
    basePath: localePath,
    limit,
    namespaces: new Set(namespaces || []),
    logger: loggerOptions,
  });

  // No namespace groups
  if (namespaceGroups.size === 0) {
    logger.warn("No namespace groups found.", {
      locale,
      basePath,
      namespaces,
    });
    return;
  }

  // Log out prepared namespace groups detail
  logger.trace("Prepared namespace groups from scanning local files.", {
    namespaceGroups: [...namespaceGroups.entries()].map(([ns, val]) => ({
      namespace: ns,
      isAtRoot: val.isAtRoot,
      fileCount: val.filePaths.length,
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
        logger: loggerOptions,
      }).then(() => validNamespaces.push(namespace)),
    );

  // Run namsapace group tasks
  await Promise.all(namespaceGroupTasks);

  // Return valid namespaces
  return validNamespaces;
};
