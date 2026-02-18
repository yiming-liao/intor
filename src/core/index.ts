// constants
export { LOCALE_PLACEHOLDER, INTOR_HEADERS } from "./constants";

// error
export { IntorError, IntorErrorCode } from "./error";

// utils
export {
  deepMerge,
  type PlainObject,
  type DeepMergeOverrideEvent,
  resolveLoaderOptions,
  parseCookieHeader,
  // normalizers
  normalizePathname,
  normalizeCacheKey,
  normalizeLocale,
  normalizeQuery,
  type NormalizedQuery,
} from "./utils";

// logger
export { getLogger, clearLoggerPool } from "./logger";

// messages
export {
  // load-remote-messages
  loadRemoteMessages,
  // merge-messages
  mergeMessages,
  // utils
  isValidMessages,
  nestObjectFromPath,
  // types
  type MessagesReader,
  type MessagesReaders,
  // internal-metadata
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
  getMessagesKind,
  type IntorMessagesKind,
} from "./messages";

// render
export {
  createHtmlRenderer,
  type TagRenderers,
  type HtmlTagRenderers,
} from "./render";

// translator
export {
  createTranslator,
  type CreateTranslatorParams,
  createTRich,
} from "./translator";

// types
export type {
  // generated
  INTOR_GENERATED_KEY,
  GenConfigKeys,
  GenConfig,
  GenMessages,
  GenLocale,
  GenReplacements,
  GenRich,
  // translator-instance
  TranslatorInstance,
  // routing
  RoutingLocaleSource,
  RoutingLocaleCarrier,
  LocalePathPrefix,
  // runtime-fetch
  RuntimeFetch,
} from "./types";
