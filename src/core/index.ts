//--------------------------------------------------------------
// constants
//--------------------------------------------------------------
export { LOCALE_PLACEHOLDER, INTOR_HEADERS } from "./constants";

//--------------------------------------------------------------
// error
//--------------------------------------------------------------
export {
  type IntorErrorOptions,
  IntorError,
  INTOR_ERROR_CODE,
  type IntorErrorCode,
} from "./error";

//--------------------------------------------------------------
// utils
//--------------------------------------------------------------
export {
  deepMerge,
  resolveLoaderOptions,
  parseCookieHeader,

  // normalizers
  normalizePathname,
  normalizeCacheKey,
  normalizeQuery,
  type NormalizedQuery,
} from "./utils";

//--------------------------------------------------------------
// locale
//--------------------------------------------------------------
export { matchLocale } from "./locale";

//--------------------------------------------------------------
// logger
//--------------------------------------------------------------
export { getLogger, clearLoggerPool } from "./logger";

//--------------------------------------------------------------
// messages
//--------------------------------------------------------------
export {
  // load-remote-messages
  loadRemoteMessages,

  // merge-messages
  mergeMessages,
  type MergeMessagesOptions,
  type MergeMessagesEvent,

  // utils
  isValidMessages,
  nestObjectFromPath,

  // types
  type MessagesReader,
  type MessagesReaders,
  type MessagesLoader,

  // internal-metadata
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
} from "./messages";

//--------------------------------------------------------------
// render
//--------------------------------------------------------------
export {
  createHtmlRenderer,
  type TagRenderers,
  type HtmlTagRenderers,
} from "./render";

//--------------------------------------------------------------
// translator
//--------------------------------------------------------------
export {
  createTranslator,
  type CreateTranslatorParams,
  createTRich,
} from "./translator";

//--------------------------------------------------------------
// types
//--------------------------------------------------------------
export type {
  // generated
  INTOR_GENERATED_KEY,
  GenConfigKeys,
  GeneratedConfigKeys,
  HasGen,

  // generated (config)
  GenConfig,
  SafeExtract,
  FallbackConfig,

  // generated (derived)
  GenMessages,
  GenLocale,
  GenReplacements,
  GenRich,

  // translator
  BaseTranslator,

  // routing
  RoutingLocaleSignal,
  RoutingLocaleSource,
  RoutingLocaleCarrier,
  LocalePathPrefix,

  // runtime-fetch
  RuntimeFetch,
} from "./types";
