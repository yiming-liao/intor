// intor (core-types)

//--------------------------------------------------------------
// core
//--------------------------------------------------------------
export type {
  // render
  TagRenderer,
  TagRenderers,
  HtmlTagRenderers,

  // messages (types)
  MessagesReader,
  MessagesReaders,
  MessagesLoader,

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
