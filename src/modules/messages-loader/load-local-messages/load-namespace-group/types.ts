import type pLimit from "p-limit";
import { Locale, LocaleNamespaceMessages, Namespace } from "intor-translator";
import { NamespaceGroupValue } from "../prepare-namespace-groups";

export interface LoadNamespaceGroupOptions {
  locale: Locale;
  namespace: Namespace;
  messages: LocaleNamespaceMessages;
  namespaceGroupValue: NamespaceGroupValue;
  limit: ReturnType<typeof pLimit>;
  configId: string;
}
