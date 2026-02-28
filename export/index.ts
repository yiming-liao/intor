// intor (core)

// core
export {
  // error
  type IntorErrorOptions,
  IntorError,
  INTOR_ERROR_CODE,
  type IntorErrorCode,

  // locale,
  matchLocale,

  // messages
  mergeMessages,
  type MergeMessagesEvent,
  type MessagesReader,
  type MessagesReaders,
  type MessagesLoader,

  // types
  type TypedConfigKeys,
  type TypedMessages,
  type TypedLocale,
  type TypedReplacements,
  type TypedRich,

  // types (routing)
  type RoutingLocaleCarrier,
  type RoutingLocaleSignal,
  type RoutingLocaleSource,
  type LocalePathPrefix,
} from "../src/core";

// config
export {
  defineIntorConfig,

  // types
  type IntorRawConfig,
  type IntorResolvedConfig,
  type IntorConfig,

  // types (loader)
  type LoaderOptions,
  type ServerLoaderOptions,
  type ClientLoaderOptions,
  type LocalLoader,
  type RemoteLoader,
  type RemoteHeaders,
  // types (translator)
  type TranslatorOptions,
  // types (translator)
  type RoutingRawOptions,
  type RoutingResolvedOptions,
  type RoutingStructuredOptions,
  type RoutingFlatOptions,
  // types (cookie)
  type CookieRawOptions,
  type CookieResolvedOptions,
  // types (logger)
  type LoggerOptions,
} from "../src/config";

// routing
export {
  localizePathname,
  type InboundResult,
  type InboundContext,
  // helper
  resolveInboundFromRequest,
} from "../src/routing";

// client
export { getClientLocale } from "../src/client";

// intor-translator
export {
  Translator,
  // plugin
  type TranslatorPlugin,
  // translation pipeline
  type TranslateContext,
  type TranslateHook,
  type TranslateHandlers,
  type HandlerContext,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  // types
  type LocaleMessages,
  type MessageObject,
  type MessageValue,
} from "intor-translator";
