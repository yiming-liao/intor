import type { NestedMessage } from "intor-translator";

export type NamespaceMessages = Record<string, NestedMessage>;

export type MessageFileReader = (
  filePath: string,
) => Promise<NamespaceMessages>;
