import path from "node:path";
import { NamespaceGroupValue, PrepareNamespaceGroupsOptions } from "./types";

type AddToNamespaceGroupOptions = {
  options: PrepareNamespaceGroupsOptions;
  filePath: string;
  namespaceGroups: Map<string, NamespaceGroupValue>;
  namespacePathSegments: string[];
};

export const addToNamespaceGroup = ({
  options: { namespaces },
  filePath,
  namespaceGroups,
  namespacePathSegments,
}: AddToNamespaceGroupOptions): void => {
  if (!filePath) {
    return;
  }

  const isAtRoot = namespacePathSegments.length === 0;

  const nsKey = isAtRoot
    ? path.basename(filePath, ".json") // Use the file name as namespace
    : namespacePathSegments.join("."); // Use "." to separate namesoaces (directory levels)

  // Check if the namespace is in the target namespaces (now using Set)
  if (namespaces && namespaces.size > 0 && !namespaces.has(nsKey)) {
    return;
  }

  // Get the namespace group or create a new one
  const group = namespaceGroups.get(nsKey) || {
    isAtRoot,
    filePaths: [],
  };

  // Use a Set to ensure uniqueness of file paths
  const filePathsSet = new Set(group.filePaths);

  // Add the file path to the group if it doesn't exist
  if (!filePathsSet.has(filePath)) {
    filePathsSet.add(filePath);
    group.filePaths = Array.from(filePathsSet); // Convert Set to Array
    namespaceGroups.set(nsKey, group);
  }
};
