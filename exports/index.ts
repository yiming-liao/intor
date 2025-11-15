// Intor
export { intor, type I18nContext, type IntorResult } from "@/modules/intor";

// Messages
export {
  loadMessages,
  loadLocalMessages,
  type LoadLocalMessagesOptions,
  loadApiMessages,
  type LoadApiMessagesOptions,
} from "@/modules/messages";

// Tools
export { getTranslator } from "@/modules/tools";

// Constants
export { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";

// Utils
export {
  mergeMessages,
  normalizeCacheKey,
  resolveNamespaces,
  normalizeLocale,
  resolvePreferredLocale,
  extractPathname,
  normalizePathname,
  standardizePathname,
} from "@/shared/utils";

// Cache
export { clearLoggerPool } from "@/shared/logger/global-logger-pool";
export { clearMessagesPool } from "@/shared/messages/global-messages-pool";

// Intor translator
export {
  Translator,
  // Translate handlers
  type TranslateHandlers,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  type TranslateHandlerContext,
  // Locale
  type Locale,
  type FallbackLocalesMap,
  // Messages
  type NestedMessage,
  type LocaleMessages,
  type LocalizedMessagesUnion,
  // Replacement
  type Replacement,
  // Keys
  type NodeKeys,
  type LeafKeys,
  type LocalizedLeafKeys,
  type ScopedLeafKeys,
} from "intor-translator";
