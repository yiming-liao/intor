// intor

// constants
export { PATHNAME_HEADER_NAME, PREFIX_PLACEHOLDER } from "@/shared/constants";

// shared / utils
export {
  deepMerge,
  normalizePathname,
  normalizeCacheKey,
  // locale
  normalizeLocale,
  resolveLocaleFromAcceptLanguage,
  // routing
  extractPathname,
  standardizePathname,
  localePrefixPathname,
  localizePathname,
} from "@/shared/utils";

// shared / error
export { IntorError, IntorErrorCode } from "@/shared/error";

// --- [dependency] intor-translator
export {
  // translator
  Translator,
  type TranslatorOptions,
  type TranslatorMethods,
  // plugin
  type TranslatorPlugin,
  // translate config & handlers
  type TranslateConfig,
  type TranslateHandlers,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  type HandlerContext,
  // pipeline
  type TranslateContext,
  type TranslateHook,
  // locale
  type Locale,
  type FallbackLocalesMap,
  // messages
  type NestedMessage,
  type LocaleMessages,
  type LocalizedMessagesUnion,
  // replacement
  type Replacement,
  // keys
  type DefaultDepth,
  type NodeKeys,
  type LeafKeys,
  type LocalizedNodeKeys,
  type LocalizedLeafKeys,
  type ScopedLeafKeys,
} from "intor-translator";
