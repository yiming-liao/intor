// Intor
export { intor } from "@/modules/intor";

// Messages loader
export { loadLocalMessages, getMessages } from "@/modules/messages-loader";
export type { LoadLocalMessagesOptions } from "@/modules/messages-loader";

// Utils
export { mergeMessages } from "@/shared/utils/merge-messages";
export { resolveNamespaces } from "@/shared/utils/resolve-namespaces";
export { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
export { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";
export { extractPathname } from "@/shared/utils/pathname/extract-pathname";
export { normalizePathname } from "@/shared/utils/pathname/normalize-pathname";
export { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";

// Intor translator
export type {
  TranslateHandlers,
  FormatMessage,
  OnLoading,
  OnMissing,
  TranslateContext,
} from "intor-translator";
export { Translator } from "intor-translator";
