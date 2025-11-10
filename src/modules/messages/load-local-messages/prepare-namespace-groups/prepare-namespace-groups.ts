import { traverseDirectory } from "./traverse-directory";
import {
  NamespaceGroupValue,
  PrepareNamespaceGroupsOptions,
} from "@/modules/messages/load-local-messages/prepare-namespace-groups/types";

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
