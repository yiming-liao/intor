// Main entry
export { intor } from "@/modules/intor";

// Intor error
export { IntorError, IntorErrorCode } from "@/modules/intor-error";

// Messages loader
export {
  loadLocalMessages,
  fetchApiMessages,
} from "@/modules/intor-messages-loader";
export type { FetchApiMessagesOptions } from "@/modules/intor-messages-loader";

// Utils
export { resolveNamespaces } from "@/shared/utils/resolve-namespaces";
export { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
export { extractPathname } from "@/shared/utils/pathname/extract-pathname";
export { normalizePathname } from "@/shared/utils/pathname/normalize-pathname";
export { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";
export { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";
export { mergeStaticAndDynamicMessages } from "@/shared/utils/merge-static-and-dynamic-messages";

// Translator
export type {
  TranslateHandlers,
  FormatMessage,
  OnLoading,
  OnMissing,
  TranslateContext,
} from "intor-translator";
export { Translator } from "intor-translator";

// Adapter
export type { IntorAdapterRuntime } from "@/modules/intor-adapter/types";

// --- Adapter: next-server
export { createIntor } from "@/adapters/next-server";
