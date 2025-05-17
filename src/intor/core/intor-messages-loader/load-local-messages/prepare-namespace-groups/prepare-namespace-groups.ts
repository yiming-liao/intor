import type { IntorLogger } from "../../../intor-logger/intor-logger";
import type pLimit from "p-limit";
import { traverseDirectory } from "./traverse-directory";

export type NamespaceGroupValue = { isAtRoot: boolean; filePaths: string[] };

export type PrepareNamespaceGroupsOptions = {
  basePath: string;
  namespaces?: Set<string>; // If not provided, all files will be scanned.
  limit: ReturnType<typeof pLimit>;
  logger?: IntorLogger;
};

export const prepareNamespaceGroups = async (
  options: PrepareNamespaceGroupsOptions,
): Promise<Map<string, NamespaceGroupValue>> => {
  const { basePath } = options;

  // Use a Map to store namespaceGroups
  const namespaceGroups = new Map<string, NamespaceGroupValue>();

  // Traverse the directory and prepare namespace groups
  await traverseDirectory({
    options,
    currentDirPath: basePath,
    namespaceGroups,
    namespacePathSegments: [],
  });

  return namespaceGroups;
};
