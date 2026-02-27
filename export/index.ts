// intor (core)

// core
export {
  // error
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

  // types
  type GenLocale as Locale,
} from "../src/core";

// config
export {
  defineIntorConfig,

  // types
  type IntorRawConfig,
  type IntorConfig,
} from "../src/config";

// routing
export { localizePathname, type InboundContext } from "../src/routing";

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
