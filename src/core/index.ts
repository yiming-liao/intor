// constants
export { PREFIX_PLACEHOLDER } from "./constants";

// error
export { IntorError, IntorErrorCode } from "./error";

// utils
export {
  deepMerge,
  resolveLoaderOptions,
  isExternalDestination,
  // normalizers
  normalizePathname,
  normalizeCacheKey,
  normalizeLocale,
  // locale
  getLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
  // pathname
  localizePathname,
} from "./utils";

// logger
export { getLogger, clearLoggerPool } from "./logger";

// messages
export {
  loadRemoteMessages,
  // messages pool
  type MessagesPool,
  getGlobalMessagesPool,
  clearMessagesPool,
  setGlobalMessagesPool,
  // utils
  isValidMessages,
  // types
  type Messages,
  type MessagesReader,
  type MessagesReadOptions,
} from "./messages";

// types
export type {
  // generated
  INTOR_GENERATED_KEY,
  IfGen,
  GenConfigKeys,
  GenConfig,
  GenMessages,
  GenLocale,
  // translator-instance
  MessageKey,
  TranslatorInstance,
  KeyMode,
  // routing
  RoutingLocaleSource,
} from "./types";
