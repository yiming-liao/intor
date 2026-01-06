// constants
export { PREFIX_PLACEHOLDER, INTOR_HEADERS } from "./constants";

// error
export { IntorError, IntorErrorCode } from "./error";

// utils
export {
  deepMerge,
  type PlainObject,
  type DeepMergeOverrideEvent,
  resolveLoaderOptions,
  // normalizers
  normalizePathname,
  normalizeCacheKey,
  normalizeLocale,
  normalizeQuery,
} from "./utils";

// logger
export { getLogger, clearLoggerPool } from "./logger";

// messages
export {
  // load-remote-messages
  loadRemoteMessages,
  // messages pool
  type MessagesPool,
  getGlobalMessagesPool,
  clearMessagesPool,
  // merge-messages
  mergeMessages,
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
  // bootstrap
  BootstrapCore,
  // translator-instance
  MessageKey,
  TranslatorInstance,
  KeyMode,
  // routing
  RoutingLocaleSource,
  RoutingLocaleCarrier,
  LocalePathPrefix,
} from "./types";
