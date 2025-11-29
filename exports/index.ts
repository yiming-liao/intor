/** intor — main */

// constants
export { PREFIX_PLACEHOLDER } from "../src/shared/constants/prefix-placeholder";

// utils
export {
  mergeMessages,
  normalizeCacheKey,
  resolveNamespaces,
  normalizeLocale,
  resolvePreferredLocale,
  extractPathname,
  normalizePathname,
  standardizePathname,
} from "../src/shared/utils";

// error
export { IntorError, IntorErrorCode } from "../src/shared/error";

// --- [dependency] intor-translator
export {
  // translator
  Translator,
  // translate-handlers
  type TranslateHandlers,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  type TranslateHandlerContext,
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
  type NodeKeys,
  type LeafKeys,
  type LocalizedLeafKeys,
  type ScopedLeafKeys,
} from "intor-translator";
