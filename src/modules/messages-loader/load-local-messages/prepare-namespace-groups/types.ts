import type pLimit from "p-limit";

export type NamespaceGroupValue = { isAtRoot: boolean; filePaths: string[] };

export type PrepareNamespaceGroupsOptions = {
  basePath: string;
  namespaces?: Set<string>; // If not provided, all files will be scanned.
  limit: ReturnType<typeof pLimit>;
  configId: string;
};
