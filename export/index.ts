/** intor */

// constants
export { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";

// utils
export {
  normalizeCacheKey,
  resolveNamespaces,
  normalizeLocale,
  resolvePreferredLocale,
  extractPathname,
  normalizePathname,
  standardizePathname,
} from "@/shared/utils";

// error
export { IntorError, IntorErrorCode } from "@/shared/error";

// --- [dependency] intor-translator
export {
  // translator
  Translator,
  type TranslatorOptions,
  type TranslatorMethods,
  // plugin
  type TranslatorPlugin,
  // translate config / handlers
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
