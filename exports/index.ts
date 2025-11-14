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
  // Translate config
  type TranslateHandlers,
  type FormatMessage,
  type OnLoading,
  type OnMissing,
  type TranslateContext,
  // basic
  type Locale,
  type Message,
  type Namespace,
  type Replacement,
  // rich replacement
  type RichReplacement,
  // message structure
  type NestedMessage,
  type NamespaceMessages,
  type LocaleNamespaceMessages,
  type UnionLocaleMessages,
  // locale
  type LocaleKey,
  type StrictLocaleKey,
  type FallbackLocalesMap,
} from "intor-translator";
