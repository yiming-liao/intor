// intor (core-types)

//--------------------------------------------------------------
// core
//--------------------------------------------------------------
export type {
  // error
  IntorErrorOptions,
  IntorError,
  INTOR_ERROR_CODE,
  IntorErrorCode,

  // messages (merge-messages)
  MergeMessagesOptions,
  MergeMessagesEvent,
  // messages (types)
  MessagesReader,
  MessagesReaders,
  MessagesLoader,

  // render
  TagRenderer,
  TagRenderers,
  HtmlTagRenderers,

  // types (generated)
  INTOR_GENERATED_KEY,
  GenConfigKeys,
  GeneratedConfigKeys,
  HasGen,
  GenConfig,
  SafeExtract,
  FallbackConfig,
  GenMessages,
  GenLocale,
  GenReplacements,
  GenRich,
  // types (translator)
  BaseTranslator,
  // types (routing)
  RoutingLocaleCarrier,
  RoutingLocaleSignal,
  RoutingLocaleSource,
  LocalePathPrefix,
  // types (runtime-fetch)
  RuntimeFetch,
} from "../src/core";

//--------------------------------------------------------------
// config
//--------------------------------------------------------------
export type {
  // types
  IntorRawConfig,
  IntorResolvedConfig,
  IntorConfig,
  // types (loader)
  LoaderOptions,
  ServerLoaderOptions,
  ClientLoaderOptions,
  LocalLoader,
  RemoteLoader,
  RemoteHeaders,
  // types (translator)
  TranslatorOptions,
  // types (translator)
  RoutingRawOptions,
  RoutingResolvedOptions,
  RoutingStructuredOptions,
  RoutingFlatOptions,
  // types (cookie)
  CookieRawOptions,
  CookieResolvedOptions,
  // types (logger)
  LoggerOptions,
} from "../src/config";

//--------------------------------------------------------------
// routing
//--------------------------------------------------------------
export type {
  // pathname
  LocalizedPathname,

  // inbound
  InboundResult,
  InboundContext,
} from "../src/routing";

//--------------------------------------------------------------
// intor-translator
//--------------------------------------------------------------
export type {
  Translator,

  // plugin
  TranslatorPlugin,

  // translation pipeline
  TranslateContext,
  TranslateHook,
  TranslateHandlers,
  HandlerContext,
  FormatHandler,
  LoadingHandler,
  MissingHandler,

  // types
  LocaleMessages,
  MessageObject,
  MessageValue,
} from "intor-translator";
