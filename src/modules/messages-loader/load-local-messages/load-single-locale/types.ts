import type pLimit from "p-limit";
import { Locale, LocaleNamespaceMessages, Namespace } from "intor-translator";

export interface LoadSingleLocaleOptions {
  basePath: string;
  locale: Locale;
  namespaces?: Namespace[];
  messages: LocaleNamespaceMessages;
  limit: ReturnType<typeof pLimit>;
  configId: string;
}
